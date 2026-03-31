const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RED_KEYWORDS = ['douleur', 'mal', 'aide', 'secours', 'tombé', 'tomber', 'urgence', 'triste', 'pleurer', 'seul', 'abandonnée', 'peur'];
const ORANGE_KEYWORDS = ['fatigué', 'pas bien', 'bof', 'moyen', 'pas dormi', 'inquiet'];

function analyzeText(transcript) {
  const text = transcript.toLowerCase();

  if (RED_KEYWORDS.some(k => text.includes(k))) {
    return { statusCouleur: 'Red', scoreHumeur: 2, resumeIa: 'Signal de détresse détecté.' };
  }
  if (ORANGE_KEYWORDS.some(k => text.includes(k))) {
    return { statusCouleur: 'Orange', scoreHumeur: 5, resumeIa: 'Humeur neutre ou légère inquiétude.' };
  }
  return { statusCouleur: 'Green', scoreHumeur: 8, resumeIa: 'Tout semble aller bien.' };
}

async function analyzeTranscript(seniorId, transcript) {
  const result = analyzeText(transcript);

  const checkIn = await prisma.checkIn.create({
    data: {
      seniorId,
      transcript,
      scoreHumeur: result.scoreHumeur,
      statusCouleur: result.statusCouleur,
      resumeIa: result.resumeIa,
    },
  });

  if (result.statusCouleur === 'Red') {
    await prisma.alert.create({
      data: {
        seniorId,
        checkInId: checkIn.id,
        type: 'DETRESSE',
      },
    });
  }

  return checkIn;
}

module.exports = { analyzeTranscript };
