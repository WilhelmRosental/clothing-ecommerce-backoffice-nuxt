/**
 *
 * @param {*} userMail - adresse mail de l'utilisateur à qui on créé le look
 * @returns l'id du look créé
 */
export default async function (userMail) {
  const supabase = useSupabaseClient()

  try {
    const { data: savedLook } = await supabase
      .from('looks')
      .insert({})
      .select()

    try {
      await supabase
        .from('looks_profiles')
        .insert({
          customer_email: userMail,
          look_id: savedLook[0].id
        })
        .select()

      return savedLook[0].id
    } catch (error) {
      console.log('Error: ', error)
    }
  } catch (error) {
    console.log('Error: ', error)
  }
}
