import * as fs from 'node:fs/promises'
import { type NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const contentType = req.headers.get('Content-Type') || ''
  if (
    ['multipart/form-data', 'application/x-www-form-urlencoded'].find(
      (x) => contentType.indexOf(x) === 0,
    )
  ) {
    const file = (await req.formData()).get('targetFile')
    if (file instanceof Blob) {
      const buffer = Buffer.from(await file.arrayBuffer())
      await fs.writeFile(
        `${new Date()
          .toLocaleString()
          .replaceAll('/', '')
          .replaceAll(':', '')
          .replaceAll(' ', '')}.webm`,
        buffer,
      )
      return NextResponse.json({ status: 'OK' })
    }
  }
  return NextResponse.json(
    { message: 'Invalid request parameter' },
    {
      status: 400,
    },
  )
}
