import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const content = await prisma.content.findMany({
        select: {
          id: true,
          title: true,
          updated_at: true,
          status: true,
          // Add other fields as needed
        },
      })
      res.status(200).json(content)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching content' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
