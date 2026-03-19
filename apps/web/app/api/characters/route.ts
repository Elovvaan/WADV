import { characterSchema, prisma } from '@wadv/lib';
import { parseJson, ok } from '../_utils';

export async function GET() {
  const characters = await prisma.character.findMany({ include: { assignments: { include: { voiceProfile: true } }, assets: true } });
  return ok({ characters });
}

export async function POST(request: Request) {
  const input = await parseJson(request, characterSchema);
  const character = await prisma.character.create({
    data: {
      ...input,
      bibleJson: { summary: `${input.name} created manually.`, notes: [] },
    },
  });
  return ok({ character }, { status: 201 });
}
