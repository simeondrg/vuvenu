'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImageIcon, Wand2, Palette, Download, Eye, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

/**
 * Schéma de validation pour la génération d'images Gemini
 */
const ImageGenerationFormSchema = z.object({
  businessName: z.string().min(1, 'Nom du business requis').max(100),
  industry: z.string().min(1, 'Sélectionnez une industrie'),
  prompt: z.string().min(10, 'Description trop courte (min 10 caractères)').max(500, 'Description trop longue (max 500 caractères)'),
  style: z.enum(['moderne', 'vintage', 'minimaliste', 'dynamique', 'premium', 'local']),
  format: z.enum(['square', 'portrait', 'landscape', 'story']),
  colors: z.array(z.string()).optional(),
  target: z.enum(['awareness', 'consideration', 'conversion']),
  platform: z.enum(['instagram', 'facebook', 'meta_ads', 'all']),
  quality: z.enum(['standard', 'high', 'premium']),
  variations: z.number().min(1).max(4)
})

type ImageGenerationFormData = z.infer<typeof ImageGenerationFormSchema>

interface GeneratedImage {
  url: string
  prompt: string
  style: string
  format: string
  width: number
  height: number
  fileSize?: number
  generatedAt: string
}

interface ImageGeneratorFormProps {
  defaultBusinessName?: string
  defaultIndustry?: string
  onImageGenerated?: (images: GeneratedImage[]) => void
}

// Configuration des options disponibles
const INDUSTRIES = [
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
  { id: 'coiffure', label: 'Salon de coiffure', emoji: '💇‍♀️' },
  { id: 'fitness', label: 'Fitness & Sport', emoji: '💪' },
  { id: 'mode', label: 'Mode & Boutique', emoji: '👗' },
  { id: 'spa', label: 'Spa & Bien-être', emoji: '🧘‍♀️' },
  { id: 'boulangerie', label: 'Boulangerie', emoji: '🥖' },
  { id: 'fleuriste', label: 'Fleuriste', emoji: '🌸' },
  { id: 'immobilier', label: 'Immobilier', emoji: '🏠' },
  { id: 'garage', label: 'Garage & Auto', emoji: '🚗' },
  { id: 'boutique', label: 'Commerce général', emoji: '🏪' },
  { id: 'cabinet_medical', label: 'Professionnel de santé', emoji: '🩺' },
  { id: 'artisan', label: 'Artisan', emoji: '🔨' }
]

const STYLES = [
  { id: 'moderne', label: 'Moderne', description: 'Lignes épurées, couleurs contemporaines' },
  { id: 'vintage', label: 'Vintage', description: 'Style rétro, nostalgie' },
  { id: 'minimaliste', label: 'Minimaliste', description: 'Simplicité, espaces blancs' },
  { id: 'dynamique', label: 'Dynamique', description: 'Énergie, mouvement' },
  { id: 'premium', label: 'Premium', description: 'Luxe, raffinement' },
  { id: 'local', label: 'Local', description: 'Authenticité réunionnaise' }
]

const FORMATS = [
  { id: 'square', label: 'Carré (1:1)', description: 'Instagram Post', dimensions: '1080×1080' },
  { id: 'portrait', label: 'Portrait (4:5)', description: 'Instagram Portrait', dimensions: '1080×1350' },
  { id: 'landscape', label: 'Paysage (16:9)', description: 'Facebook Post', dimensions: '1200×628' },
  { id: 'story', label: 'Story (9:16)', description: 'Instagram/Facebook Story', dimensions: '1080×1920' }
]

const QUALITY_LEVELS = [
  { id: 'standard', label: 'Standard', description: 'Qualité normale', cost: '0.05€' },
  { id: 'high', label: 'Haute qualité', description: 'Meilleure résolution', cost: '0.08€' },
  { id: 'premium', label: 'Premium', description: 'Qualité professionnelle', cost: '0.13€' }
]

const COLOR_PRESETS = [
  { name: 'VuVenu', colors: ['#BFFF00', '#0F172A'] },
  { name: 'Océan', colors: ['#0EA5E9', '#0F766E'] },
  { name: 'Sunset', colors: ['#F97316', '#EF4444'] },
  { name: 'Nature', colors: ['#22C55E', '#15803D'] },
  { name: 'Élégant', colors: ['#6366F1', '#8B5CF6'] },
  { name: 'Warm', colors: ['#F59E0B', '#DC2626'] }
]

/**
 * Composant principal de génération d'images avec Gemini
 */
export function ImageGeneratorForm({
  defaultBusinessName = '',
  defaultIndustry = '',
  onImageGenerated
}: ImageGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [estimatedCost, setEstimatedCost] = useState(0.05)

  const form = useForm<ImageGenerationFormData>({
    resolver: zodResolver(ImageGenerationFormSchema),
    defaultValues: {
      businessName: defaultBusinessName,
      industry: defaultIndustry,
      prompt: '',
      style: 'moderne',
      format: 'square',
      colors: [],
      target: 'awareness',
      platform: 'meta_ads',
      quality: 'standard',
      variations: 1
    }
  })

  // Calcul du coût estimé en temps réel
  useEffect(() => {
    const subscription = form.watch((value) => {
      const baseCost = 0.05
      const qualityMultipliers = { standard: 1, high: 1.5, premium: 2.5 }
      const variations = value.variations || 1
      const quality = value.quality || 'standard'

      const cost = variations * baseCost * qualityMultipliers[quality]
      setEstimatedCost(cost)
    })

    return () => subscription.unsubscribe()
  }, [form])

  // Génération des images
  const onSubmit = async (data: ImageGenerationFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'direct', // Nouveau système Gemini
          ...data,
          colors: selectedColors.length > 0 ? selectedColors : undefined
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur de génération')
      }

      if (result.success) {
        setGeneratedImages(result.images)
        onImageGenerated?.(result.images)

        toast.success(`${result.images.length} image(s) générée(s) avec succès !`, {
          description: `Coût total: ${result.totalCost.toFixed(2)}€`
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Image generation error:', error)
      toast.error('Erreur lors de la génération', {
        description: error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleColorPresetSelect = (colors: string[]) => {
    setSelectedColors(colors)
    form.setValue('colors', colors)
  }

  const handleColorRemove = (colorToRemove: string) => {
    const newColors = selectedColors.filter(c => c !== colorToRemove)
    setSelectedColors(newColors)
    form.setValue('colors', newColors)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Générateur d'Images IA</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Créez des visuels publicitaires avec Google Gemini
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations Business */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Informations Business
              </CardTitle>
              <CardDescription>
                Détails sur votre entreprise pour personnaliser les images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Nom du Business</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon Restaurant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Secteur d'activité</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un secteur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRIES.map((industry) => (
                            <SelectItem key={industry.id} value={industry.id}>
                              <div className="flex items-center gap-2">
                                <span>{industry.emoji}</span>
                                {industry.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Description de l'image */}
          <Card>
            <CardHeader>
              <CardTitle>Description de l'Image</CardTitle>
              <CardDescription>
                Décrivez précisément l'image que vous souhaitez générer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control as any}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt de génération</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Une assiette de cuisine créole appetissante avec des couleurs vives, photographiée dans un restaurant chaleureux..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 caractères
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Style & Format */}
          <Card>
            <CardHeader>
              <CardTitle>Style & Format</CardTitle>
              <CardDescription>
                Définissez l'apparence et les dimensions de votre image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Style visuel</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {STYLES.map((style) => (
                          <div
                            key={style.id}
                            className={`
                              relative cursor-pointer rounded-lg border-2 p-3 text-center transition-all
                              ${field.value === style.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-200 dark:border-gray-700'
                              }
                            `}
                            onClick={() => field.onChange(style.id)}
                          >
                            <div className="text-sm font-medium">{style.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{style.description}</div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Format d'image</FormLabel>
                      <div className="space-y-2">
                        {FORMATS.map((format) => (
                          <div
                            key={format.id}
                            className={`
                              cursor-pointer rounded-lg border-2 p-3 transition-all
                              ${field.value === format.id
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-200 dark:border-gray-700'
                              }
                            `}
                            onClick={() => field.onChange(format.id)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-sm">{format.label}</div>
                                <div className="text-xs text-gray-500">{format.description}</div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {format.dimensions}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Palette de couleurs */}
              <div className="space-y-4">
                <div>
                  <FormLabel className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Palette de couleurs (optionnel)
                  </FormLabel>
                  <FormDescription className="mt-1">
                    Choisissez des couleurs pour guider la génération
                  </FormDescription>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <div
                      key={preset.name}
                      className="cursor-pointer rounded-lg border p-3 hover:border-blue-300 transition-colors"
                      onClick={() => handleColorPresetSelect(preset.colors)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {preset.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <span className="text-sm font-medium">{preset.name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Couleurs sélectionnées */}
                {selectedColors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map((color, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleColorRemove(color)}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {color}
                        ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Options avancées */}
          <Card>
            <CardHeader>
              <CardTitle>Options Avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="quality"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Qualité</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QUALITY_LEVELS.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              <div className="flex justify-between w-full items-center">
                                <span>{level.label}</span>
                                <Badge variant="outline" className="ml-2">
                                  {level.cost}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="variations"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Variations</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={4}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>1 à 4 variations</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Plateforme cible</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="meta_ads">Meta Ads</SelectItem>
                          <SelectItem value="all">Toutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Coût estimé */}
              <Alert>
                <AlertDescription className="flex justify-between items-center">
                  <span>Coût estimé de génération:</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    {estimatedCost.toFixed(2)}€
                  </Badge>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Bouton de génération */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Générer les Images ({estimatedCost.toFixed(2)}€)
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Images générées */}
      {generatedImages.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Images Générées ({generatedImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedImages.map((image, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border">
                  <img
                    src={image.url}
                    alt={`Image générée ${idx + 1}`}
                    className="w-full h-auto aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" size="sm" className="bg-white bg-opacity-90">
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black bg-opacity-70 text-white">
                      {image.width}×{image.height}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}