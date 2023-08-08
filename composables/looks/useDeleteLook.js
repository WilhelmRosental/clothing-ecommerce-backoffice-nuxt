/**
 *
 * @param {*} lookId
 * @returns deletedLook
 */
export default async function (lookId) {
  const supabase = useSupabaseClient()

  // On supprime les liens avec les clients
  try {
    await supabase
      .from('looks_profiles')
      .delete()
      .eq('look_id', lookId)
  } catch (error) {
    console.log('Error: ', error)
  }

  // On supprime la miniature
  try {
    await supabase.storage
      .from('looks-images')
      .remove(lookId)
  } catch (error) {
    console.log('Error:', error)
  }

  // On supprime le look
  try {
    const { data: deletedLook } = await supabase
      .from('looks')
      .delete()
      .eq('id', lookId)
      .select()

    return deletedLook
  } catch (error) {
    console.log('Error: ', error)
  }
}
