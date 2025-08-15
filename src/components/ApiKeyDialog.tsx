import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Key, Shield } from 'lucide-react';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyDialog = ({ open, onOpenChange, onApiKeySubmit }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onApiKeySubmit(apiKey.trim());
      onOpenChange(false);
      setApiKey('');
    } catch (error) {
      console.error('API key validation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-panel border-panel-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Enter Runware API Key
          </DialogTitle>
          <DialogDescription>
            To use AI image generation, you need a valid Runware API key from{' '}
            <a 
              href="https://my.runware.ai/signup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              my.runware.ai
            </a>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Runware API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-input border-input-border focus:border-input-focus"
              required
            />
          </div>
          
          <Alert className="border-primary/20 bg-primary/5">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              Your API key is stored locally and never shared. For better security, consider{' '}
              <span className="text-primary font-medium">connecting to Supabase</span> to store secrets securely.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              disabled={!apiKey.trim() || isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                'Connect API Key'
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open('https://my.runware.ai/signup', '_blank')}
              className="border-panel-border hover:bg-panel"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Get API Key from Runware
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};