import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { RoleType } from '@prisma/client';

export class AuthService {
  static async register(data: { email: string; password: string; fullName: string; role?: RoleType; department?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('A user with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        role: data.role || RoleType.USER,
        department: data.department || 'Product Engineering'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        department: true,
        createdAt: true
      }
    });

    const tokens = this.generateTokens(user.id, user.role, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const tokens = this.generateTokens(user.id, user.role, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl
      },
      tokens
    };
  }

  static async refreshToken(refreshToken: string) {
    const record = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!record || record.isRevoked || record.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token.');
    }

    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user || !user.isActive) {
      throw new Error('User account not found or deactivated.');
    }

    // Revoke old token and issue new pair
    await prisma.refreshToken.update({
      where: { id: record.id },
      data: { isRevoked: true }
    });

    const tokens = this.generateTokens(user.id, user.role, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  static async logout(refreshToken: string) {
    try {
      await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { isRevoked: true }
      });
      return true;
    } catch {
      return false;
    }
  }

  private static generateTokens(userId: string, role: RoleType, email: string) {
    const accessToken = jwt.sign(
      { userId, role, email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    const refreshToken = jwt.sign(
      { userId },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
    );

    return { accessToken, refreshToken };
  }

  private static async storeRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });
  }
}
