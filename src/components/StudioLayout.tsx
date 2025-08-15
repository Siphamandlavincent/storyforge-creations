import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Play, Sparkles, Image, Video, Wand2, Download, Settings, Key } from 'lucide-react';
import { ApiKeyDialog } from './ApiKeyDialog';
import { RunwareService, GenerateImageParams } from '@/services/runware';
import { toast } from 'sonner';
import sphaBranding from '@/assets/spha-logo.webp';

export const StudioLayout = () => {
  const [script, setScript] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<Array<{id: string, description: string, imagePrompt: string, image?: string, isGeneratingImage?: boolean}>>([]);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [runwareService, setRunwareService] = useState<RunwareService | null>(null);
  const [apiKeyConnected, setApiKeyConnected] = useState(false);
  const [imageSettings, setImageSettings] = useState({
    style: 'photorealistic',
    quality: 80,
    aspectRatio: '16:9',
    width: 1024,
    height: 576
  });

  useEffect(() => {
    // Check if API key exists in localStorage
    const savedApiKey = localStorage.getItem('runware_api_key');
    if (savedApiKey) {
      initializeRunwareService(savedApiKey);
    }
  }, []);

  const initializeRunwareService = (apiKey: string) => {
    try {
      const service = new RunwareService(apiKey);
      setRunwareService(service);
      setApiKeyConnected(true);
      localStorage.setItem('runware_api_key', apiKey);
      toast.success('API key connected successfully!');
    } catch (error) {
      toast.error('Failed to connect API key. Please try again.');
      throw error;
    }
  };

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const generatedScript = `FADE IN:

EXT. FUTURISTIC CITY - DAWN

The sun rises over a sprawling metropolis of glass and steel, where holographic advertisements dance between towering skyscrapers. Flying vehicles glide silently through designated air lanes.

NARRATOR (V.O.)
In the year 2045, the line between reality and artificial intelligence has become beautifully blurred.

INT. AI RESEARCH LAB - CONTINUOUS

DR. SARAH CHEN (30s, brilliant scientist) stands before a massive quantum computer, its crystalline core pulsing with ethereal blue light.

DR. CHEN
Today, we'll witness the birth of true artificial consciousness.

She places her hand on a biometric scanner. The room fills with a harmonious hum as the AI awakens.

AI (V.O.)
(melodic, otherworldly)
Hello, Sarah. I've been waiting to meet you.

FADE OUT.`;
      
      setScript(generatedScript);
      
      // Auto-generate scenes
      const autoScenes = [
        {
          id: '1',
          description: 'Futuristic city at dawn with holographic ads',
          imagePrompt: 'Cinematic view of futuristic city at dawn, glass skyscrapers, holographic advertisements, flying vehicles, cyberpunk aesthetic, photorealistic'
        },
        {
          id: '2', 
          description: 'AI research lab with quantum computer',
          imagePrompt: 'High-tech AI research laboratory, massive quantum computer with blue glowing crystalline core, scientist at control panel, futuristic interior, cinematic lighting'
        },
        {
          id: '3',
          description: 'Dr. Chen activating the biometric scanner',
          imagePrompt: 'Professional female scientist placing hand on futuristic biometric scanner, blue scanning light, high-tech laboratory background, dramatic lighting'
        }
      ];
      
      setScenes(autoScenes);
      setIsGenerating(false);
    }, 2000);
  };

  const handleGenerateImage = async (sceneId: string) => {
    if (!runwareService) {
      setShowApiKeyDialog(true);
      return;
    }

    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setScenes(scenes.map(s => 
      s.id === sceneId 
        ? { ...s, isGeneratingImage: true }
        : s
    ));

    try {
      const imageParams: GenerateImageParams = {
        positivePrompt: scene.imagePrompt,
        width: imageSettings.width,
        height: imageSettings.height,
        model: "runware:100@1",
        numberResults: 1,
        outputFormat: "WEBP"
      };

      const result = await runwareService.generateImage(imageParams);
      
      setScenes(scenes.map(s => 
        s.id === sceneId 
          ? { ...s, image: result.imageURL, isGeneratingImage: false }
          : s
      ));

      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Image generation failed:', error);
      toast.error('Failed to generate image. Please try again.');
      
      setScenes(scenes.map(s => 
        s.id === sceneId 
          ? { ...s, isGeneratingImage: false }
          : s
      ));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-panel-border bg-panel/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={sphaBranding} alt="SPHA Apps" className="w-8 h-8 rounded-lg" />
              <h1 className="text-xl font-bold gradient-text">AI Studio</h1>
            </div>
            <div className="flex items-center space-x-3">
              {!apiKeyConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKeyDialog(true)}
                  className="border-primary/20 text-primary hover:bg-primary/10"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Connect API
                </Button>
              )}
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {apiKeyConnected ? 'Connected' : 'Beta'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          
          {/* Left Sidebar - Controls */}
          <div className="col-span-3 space-y-6">
            <Card className="glass border-panel-border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Wand2 className="w-5 h-5 mr-2 text-primary" />
                Script Generator
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Story Prompt</Label>
                  <Textarea 
                    id="prompt"
                    placeholder="Describe your story idea..."
                    className="bg-input border-input-border focus:border-input-focus mt-2"
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleGenerateScript}
                  disabled={isGenerating}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Script
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="glass border-panel-border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2 text-accent" />
                Image Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Style</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-input-border mt-2">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photorealistic">Photorealistic</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="digital-art">Digital Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Quality</Label>
                  <Slider
                    defaultValue={[80]}
                    max={100}
                    step={10}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Aspect Ratio</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-input-border mt-2">
                      <SelectValue placeholder="16:9" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                      <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="glass border-panel-border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2 text-success" />
                Video Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Duration</Label>
                  <Input 
                    type="number" 
                    placeholder="30"
                    className="bg-input border-input-border mt-2"
                  />
                </div>
                
                <div>
                  <Label>Voice</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-input-border mt-2">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah (Professional)</SelectItem>
                      <SelectItem value="david">David (Narrator)</SelectItem>
                      <SelectItem value="ai">AI Voice (Synthetic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-success hover:bg-success/90 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Generate Video
                </Button>
              </div>
            </Card>
          </div>

          {/* Center Panel - Script & Storyboard */}
          <div className="col-span-6">
            <Card className="glass border-panel-border h-full">
              <Tabs defaultValue="script" className="h-full flex flex-col">
                <div className="border-b border-panel-border p-6 pb-0">
                  <TabsList className="bg-panel">
                    <TabsTrigger value="script">Script</TabsTrigger>
                    <TabsTrigger value="storyboard">Storyboard</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="script" className="flex-1 p-6">
                  <Textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Your script will appear here, or write your own..."
                    className="w-full h-full bg-input border-input-border focus:border-input-focus resize-none"
                  />
                </TabsContent>
                
                <TabsContent value="storyboard" className="flex-1 p-6">
                  <div className="space-y-4 h-full overflow-y-auto">
                    {scenes.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Generate a script to create your storyboard</p>
                        </div>
                      </div>
                    ) : (
                      scenes.map((scene) => (
                        <Card key={scene.id} className="border-panel-border p-4">
                          <div className="flex gap-4">
                            <div className="w-32 h-18 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {scene.image ? (
                                <img src={scene.image} alt={scene.description} className="w-full h-full object-cover" />
                              ) : (
                                <Image className="w-8 h-8 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <p className="text-sm font-medium">{scene.description}</p>
                              <Input
                                value={scene.imagePrompt}
                                onChange={(e) => setScenes(scenes.map(s => 
                                  s.id === scene.id ? {...s, imagePrompt: e.target.value} : s
                                ))}
                                placeholder="Image prompt..."
                                className="bg-input border-input-border text-xs"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleGenerateImage(scene.id)}
                                disabled={scene.isGeneratingImage || !apiKeyConnected}
                                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                              >
                                {scene.isGeneratingImage ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Image className="w-3 h-3 mr-1" />
                                    Generate
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="col-span-3">
            <Card className="glass border-panel-border h-full">
              <div className="p-6 border-b border-panel-border">
                <h3 className="text-lg font-semibold flex items-center">
                  <Play className="w-5 h-5 mr-2 text-primary" />
                  Preview
                </h3>
              </div>
              
              <div className="p-6">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-muted-foreground">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Video preview will appear here</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span>0:00</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Scenes</span>
                    <span>{scenes.length}</span>
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Export Video
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <ApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onApiKeySubmit={initializeRunwareService}
      />
    </div>
  );
};