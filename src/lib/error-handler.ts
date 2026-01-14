/**
 * Gestionnaire centralisé des erreurs avec messages user-friendly
 * Transforme les erreurs techniques en messages compréhensibles + codes support
 */

// Types d'erreurs avec codes standardisés
export enum ErrorCode {
  // Erreurs API IA
  CLAUDE_TIMEOUT = 'ERR-CLAUDE-001',
  CLAUDE_RATE_LIMIT = 'ERR-CLAUDE-002',
  CLAUDE_UNAVAILABLE = 'ERR-CLAUDE-003',
  GEMINI_TIMEOUT = 'ERR-GEMINI-001',
  GEMINI_RATE_LIMIT = 'ERR-GEMINI-002',
  GEMINI_UNAVAILABLE = 'ERR-GEMINI-003',

  // Erreurs authentification
  AUTH_REQUIRED = 'ERR-AUTH-001',
  AUTH_EXPIRED = 'ERR-AUTH-002',
  AUTH_INVALID = 'ERR-AUTH-003',

  // Erreurs limites utilisateur
  SCRIPT_LIMIT_REACHED = 'ERR-LIMIT-001',
  CAMPAIGN_LIMIT_REACHED = 'ERR-LIMIT-002',
  RATE_LIMIT_EXCEEDED = 'ERR-LIMIT-003',

  // Erreurs validation
  VALIDATION_FAILED = 'ERR-VALID-001',
  INPUT_TOO_LONG = 'ERR-VALID-002',
  DANGEROUS_CONTENT = 'ERR-VALID-003',

  // Erreurs base de données
  PROFILE_NOT_FOUND = 'ERR-DB-001',
  SAVE_FAILED = 'ERR-DB-002',
  CAMPAIGN_NOT_FOUND = 'ERR-DB-003',

  // Erreurs système
  NETWORK_ERROR = 'ERR-SYS-001',
  UNKNOWN_ERROR = 'ERR-SYS-999'
}

export interface UserFriendlyError {
  code: ErrorCode
  title: string
  message: string
  action?: string
  helpUrl?: string
  technical?: string // Pour les logs/debug
}

// Catalogue des messages d'erreur user-friendly
const ERROR_MESSAGES: Record<ErrorCode, Omit<UserFriendlyError, 'code' | 'technical'>> = {
  // Erreurs IA
  [ErrorCode.CLAUDE_TIMEOUT]: {
    title: 'Génération en cours...',
    message: 'La génération prend plus de temps que prévu. Nous continuons d\'essayer pour vous.',
    action: 'Patientez encore quelques secondes ou réessayez.',
    helpUrl: '/help/generation-lente'
  },
  [ErrorCode.CLAUDE_RATE_LIMIT]: {
    title: 'Trop de demandes',
    message: 'Vous générez beaucoup de contenu ! Pour maintenir la qualité, merci de patienter 1 minute.',
    action: 'Réessayez dans une minute',
    helpUrl: '/help/limites-generation'
  },
  [ErrorCode.CLAUDE_UNAVAILABLE]: {
    title: 'Service temporairement indisponible',
    message: 'Notre service de génération de scripts est en maintenance. Il sera de retour sous peu.',
    action: 'Réessayez dans 5-10 minutes',
    helpUrl: '/help/service-indisponible'
  },
  [ErrorCode.GEMINI_TIMEOUT]: {
    title: 'Génération d\'image en cours...',
    message: 'La création de votre image prend plus de temps que prévu.',
    action: 'Patientez encore quelques secondes',
    helpUrl: '/help/generation-images'
  },
  [ErrorCode.GEMINI_RATE_LIMIT]: {
    title: 'Limite d\'images atteinte',
    message: 'Pour maintenir la qualité des images, merci d\'attendre avant de générer la suivante.',
    action: 'Réessayez dans 2 minutes',
    helpUrl: '/help/limites-images'
  },
  [ErrorCode.GEMINI_UNAVAILABLE]: {
    title: 'Service d\'images indisponible',
    message: 'Notre générateur d\'images est temporairement en maintenance.',
    action: 'Réessayez dans 10-15 minutes',
    helpUrl: '/help/service-images'
  },

  // Erreurs authentification
  [ErrorCode.AUTH_REQUIRED]: {
    title: 'Connexion requise',
    message: 'Vous devez être connecté pour utiliser cette fonctionnalité.',
    action: 'Connectez-vous ou créez un compte',
    helpUrl: '/help/connexion'
  },
  [ErrorCode.AUTH_EXPIRED]: {
    title: 'Session expirée',
    message: 'Votre session a expiré pour des raisons de sécurité.',
    action: 'Reconnectez-vous pour continuer',
    helpUrl: '/help/session-expiree'
  },
  [ErrorCode.AUTH_INVALID]: {
    title: 'Accès refusé',
    message: 'Vos identifiants ne sont pas valides.',
    action: 'Vérifiez vos identifiants ou réinitialisez votre mot de passe',
    helpUrl: '/help/probleme-connexion'
  },

  // Erreurs limites
  [ErrorCode.SCRIPT_LIMIT_REACHED]: {
    title: 'Limite de scripts atteinte',
    message: 'Vous avez utilisé tous vos scripts ce mois-ci ! Passez au plan Pro pour générer 3x plus de contenu.',
    action: 'Upgrader votre plan ou attendre le mois prochain',
    helpUrl: '/help/limites-plan'
  },
  [ErrorCode.CAMPAIGN_LIMIT_REACHED]: {
    title: 'Limite de campagnes atteinte',
    message: 'Les campagnes Meta Ads sont disponibles avec les plans Pro et Business.',
    action: 'Upgrader vers le plan Pro',
    helpUrl: '/help/campagnes-pro'
  },
  [ErrorCode.RATE_LIMIT_EXCEEDED]: {
    title: 'Ralentissez un peu ! 🚦',
    message: 'Vous générez très rapidement du contenu. Laissez-nous quelques secondes pour traiter votre demande.',
    action: 'Attendez 30 secondes et réessayez',
    helpUrl: '/help/generation-rapide'
  },

  // Erreurs validation
  [ErrorCode.VALIDATION_FAILED]: {
    title: 'Informations manquantes',
    message: 'Certaines informations requises sont manquantes ou incorrectes.',
    action: 'Vérifiez les champs en rouge et corrigez-les',
    helpUrl: '/help/formulaire-invalid'
  },
  [ErrorCode.INPUT_TOO_LONG]: {
    title: 'Texte trop long',
    message: 'Votre texte dépasse la limite autorisée. Raccourcissez-le pour une meilleure qualité.',
    action: 'Réduisez votre texte à moins de 10 000 caractères',
    helpUrl: '/help/limites-texte'
  },
  [ErrorCode.DANGEROUS_CONTENT]: {
    title: 'Contenu non autorisé détecté',
    message: 'Votre texte contient des éléments qui ne peuvent pas être traités.',
    action: 'Réécrivez votre texte en évitant les scripts ou codes',
    helpUrl: '/help/contenu-autorise'
  },

  // Erreurs BDD
  [ErrorCode.PROFILE_NOT_FOUND]: {
    title: 'Profil introuvable',
    message: 'Impossible de charger vos informations de profil.',
    action: 'Reconnectez-vous ou contactez le support',
    helpUrl: '/help/profil-perdu'
  },
  [ErrorCode.SAVE_FAILED]: {
    title: 'Sauvegarde échouée',
    message: 'Impossible de sauvegarder vos données. Elles sont peut-être temporairement perdues.',
    action: 'Réessayez de sauvegarder ou copiez votre contenu en attendant',
    helpUrl: '/help/probleme-sauvegarde'
  },
  [ErrorCode.CAMPAIGN_NOT_FOUND]: {
    title: 'Campagne introuvable',
    message: 'Cette campagne n\'existe pas ou a été supprimée.',
    action: 'Retournez à la liste de vos campagnes',
    helpUrl: '/help/campagne-perdue'
  },

  // Erreurs système
  [ErrorCode.NETWORK_ERROR]: {
    title: 'Problème de connexion',
    message: 'Impossible de se connecter à nos serveurs. Vérifiez votre connexion internet.',
    action: 'Vérifiez votre wifi/4G et réessayez',
    helpUrl: '/help/connexion-internet'
  },
  [ErrorCode.UNKNOWN_ERROR]: {
    title: 'Erreur inattendue',
    message: 'Une erreur inattendue s\'est produite. Notre équipe a été automatiquement notifiée.',
    action: 'Réessayez dans quelques minutes ou contactez le support',
    helpUrl: '/help/erreur-inconnue'
  }
}

/**
 * Détermine le code d'erreur approprié selon l'erreur technique
 */
export function classifyError(error: unknown): ErrorCode {
  if (!error) return ErrorCode.UNKNOWN_ERROR

  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  // Erreurs IA - Claude
  if (errorMessage.includes('claude') || errorMessage.includes('anthropic')) {
    if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
      return ErrorCode.CLAUDE_TIMEOUT
    }
    if (errorMessage.includes('rate') && errorMessage.includes('limit')) {
      return ErrorCode.CLAUDE_RATE_LIMIT
    }
    return ErrorCode.CLAUDE_UNAVAILABLE
  }

  // Erreurs IA - Gemini
  if (errorMessage.includes('gemini') || errorMessage.includes('imagen') || errorMessage.includes('google')) {
    if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
      return ErrorCode.GEMINI_TIMEOUT
    }
    if (errorMessage.includes('rate') && errorMessage.includes('limit')) {
      return ErrorCode.GEMINI_RATE_LIMIT
    }
    return ErrorCode.GEMINI_UNAVAILABLE
  }

  // Erreurs auth
  if (errorMessage.includes('non authentifié') || errorMessage.includes('unauthorized')) {
    return ErrorCode.AUTH_REQUIRED
  }
  if (errorMessage.includes('session') || errorMessage.includes('expired')) {
    return ErrorCode.AUTH_EXPIRED
  }
  if (errorMessage.includes('invalid') && errorMessage.includes('credential')) {
    return ErrorCode.AUTH_INVALID
  }

  // Erreurs limites
  if (errorMessage.includes('limite') && errorMessage.includes('script')) {
    return ErrorCode.SCRIPT_LIMIT_REACHED
  }
  if (errorMessage.includes('limite') && errorMessage.includes('campagne')) {
    return ErrorCode.CAMPAIGN_LIMIT_REACHED
  }
  if (errorMessage.includes('rate limit exceeded') || errorMessage.includes('429')) {
    return ErrorCode.RATE_LIMIT_EXCEEDED
  }

  // Erreurs validation
  if (errorMessage.includes('données invalides') || errorMessage.includes('validation')) {
    return ErrorCode.VALIDATION_FAILED
  }
  if (errorMessage.includes('trop long') || errorMessage.includes('max') && errorMessage.includes('chars')) {
    return ErrorCode.INPUT_TOO_LONG
  }
  if (errorMessage.includes('non autorisé') || errorMessage.includes('dangerous')) {
    return ErrorCode.DANGEROUS_CONTENT
  }

  // Erreurs BDD
  if (errorMessage.includes('profil') && errorMessage.includes('introuvable')) {
    return ErrorCode.PROFILE_NOT_FOUND
  }
  if (errorMessage.includes('sauvegarde') || errorMessage.includes('save')) {
    return ErrorCode.SAVE_FAILED
  }
  if (errorMessage.includes('campagne') && errorMessage.includes('introuvable')) {
    return ErrorCode.CAMPAIGN_NOT_FOUND
  }

  // Erreurs réseau
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
    return ErrorCode.NETWORK_ERROR
  }

  return ErrorCode.UNKNOWN_ERROR
}

/**
 * Transforme une erreur technique en message user-friendly
 */
export function createUserFriendlyError(error: unknown, context?: string): UserFriendlyError {
  const errorCode = classifyError(error)
  const errorTemplate = ERROR_MESSAGES[errorCode]

  return {
    code: errorCode,
    ...errorTemplate,
    technical: error instanceof Error ? `${context ? context + ': ' : ''}${error.message}` : String(error)
  }
}

/**
 * Formate un message d'erreur pour l'affichage dans l'interface
 */
export function formatErrorForDisplay(error: UserFriendlyError): {
  title: string
  message: string
  action?: string
  supportInfo: string
} {
  return {
    title: error.title,
    message: error.message,
    action: error.action,
    supportInfo: `Code d'erreur : ${error.code}${error.helpUrl ? ' • ' + error.helpUrl : ''}`
  }
}

/**
 * Logs structured error information for monitoring/debugging
 */
export function logError(error: UserFriendlyError, userId?: string, context?: string): void {
  console.error('🚨 Erreur utilisateur:', {
    code: error.code,
    title: error.title,
    context: context || 'unknown',
    userId: userId || 'anonymous',
    technical: error.technical,
    timestamp: new Date().toISOString()
  })

  // En production, envoyer vers un service de logging (Sentry, DataDog, etc.)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Intégrer avec Sentry/DataDog
    // sentry.captureException(error, { user: { id: userId }, extra: { context } })
  }
}

/**
 * Helper pour envelopper des fonctions async et gérer les erreurs
 */
export async function withErrorHandling<T>(
  asyncFn: () => Promise<T>,
  context: string,
  userId?: string
): Promise<{ result?: T; error?: UserFriendlyError }> {
  try {
    const result = await asyncFn()
    return { result }
  } catch (error) {
    const userFriendlyError = createUserFriendlyError(error, context)
    logError(userFriendlyError, userId, context)
    return { error: userFriendlyError }
  }
}