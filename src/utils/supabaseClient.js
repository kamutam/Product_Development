import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nigpdqbjzgibbecixkcd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_l7SgnabiTl1ZmCMMo6FyyQ_wEusFiAK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Saves a compiled Tender Dossier to the Supabase Database Vault.
 */
export const saveTenderDossierToVault = async (dossier) => {
  if (!dossier) return { success: false, error: 'No dossier provided' };

  try {
    const gemId = dossier.gemDocument?.gemId || dossier.dossierSummary?.gemId || `TENDER-${Date.now()}`;
    const tenderRefNo = dossier.dossierSummary?.tenderRefNo || dossier.gemDocument?.tenderRefNo || gemId;
    const orgName = dossier.gemDocument?.organisationName || dossier.dossierSummary?.organisationName || 'Government Procurement Authority';
    const tenderTitle = dossier.dossierSummary?.tenderName || 'Turnkey Tender Specification Dossier';
    const ecv = dossier.gemDocument?.ecvValue || 'Item Rate';
    const emd = dossier.gemDocument?.emdAmount || 'Refer to GeM Portal';
    const lastDate = dossier.gemDocument?.lastDate || 'As per Schedule';
    const preBidDate = dossier.gemDocument?.preBidMeetingDate || 'Not Specified';

    const { data, error } = await supabase
      .from('tender_dossiers')
      .upsert({
        gem_id: tenderRefNo,
        organisation_name: orgName,
        tender_name: tenderTitle,
        ecv_value: ecv,
        emd_amount: emd,
        last_date: lastDate,
        pre_bid_date: preBidDate,
        dossier_data: dossier
      }, { onConflict: 'gem_id' })
      .select();

    if (error) {
      console.warn('Supabase save error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error saving tender to Supabase:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetches all saved tender dossiers from Supabase.
 */
export const fetchSavedTendersFromVault = async () => {
  try {
    const { data, error } = await supabase
      .from('tender_dossiers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching tenders:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to fetch saved tenders:', err);
    return [];
  }
};

/**
 * Deletes a tender dossier from Supabase.
 */
export const deleteTenderFromVault = async (id) => {
  try {
    const { error } = await supabase
      .from('tender_dossiers')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Initiates Google OAuth Sign-In via Supabase.
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Signs out the currently authenticated user.
 */
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
