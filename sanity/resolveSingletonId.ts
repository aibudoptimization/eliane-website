import type {SanityClient} from 'sanity'

/** Resolve the document id Studio should open for a singleton schema type. */
export async function resolveSingletonDocumentId(
  client: SanityClient,
  schemaType: string,
  preferredId: string,
): Promise<string> {
  const existingById = await client.fetch<string | null>(
    `*[_id in [$preferredId, $draftId]][0]._id`,
    {preferredId, draftId: `drafts.${preferredId}`},
  )
  if (existingById) return preferredId

  const existingByType = await client.fetch<string | null>(
    `*[_type == $schemaType][0]._id`,
    {schemaType},
  )
  if (existingByType) return existingByType

  return preferredId
}
