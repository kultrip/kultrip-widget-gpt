import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Mail, CreditCard, Check, Star, MapPin, Calendar, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationInfo: {
    destination: string;
    story: string;
    duration?: number;
    preferences: string[];
  };
}

export function PaymentModal({ isOpen, onClose, destinationInfo }: PaymentModalProps) {
  const [currentStep, setCurrentStep] = useState<'preview' | 'details' | 'payment' | 'success'>('preview');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleNext = () => {
    if (currentStep === 'preview') setCurrentStep('details');
    else if (currentStep === 'details') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('success');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name.trim() && formData.email.trim().includes('@');

  const features = [
    { icon: <MapPin className="w-4 h-4" />, text: "Interactive map with story locations" },
    { icon: <Calendar className="w-4 h-4" />, text: "Day-by-day personalized itinerary" },
    { icon: <Users className="w-4 h-4" />, text: "Local insider tips & recommendations" },
    { icon: <Star className="w-4 h-4" />, text: "Curated restaurants & experiences" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {currentStep === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Get Your Complete Travel Guide
                </DialogTitle>
              </DialogHeader>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {destinationInfo.story} in {destinationInfo.destination}
                  </CardTitle>
                  <CardDescription>
                    {destinationInfo.duration ? `${destinationInfo.duration} days` : 'Custom duration'} • 
                    {destinationInfo.preferences.length} preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {destinationInfo.preferences.slice(0, 3).map((pref, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {pref}
                      </Badge>
                    ))}
                    {destinationInfo.preferences.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{destinationInfo.preferences.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">What's included in your guide:</h4>
                <div className="space-y-2">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="text-primary">{feature.icon}</div>
                      {feature.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <div className="text-2xl font-bold text-primary">$12</div>
                  <div className="text-xs text-muted-foreground">One-time payment</div>
                </div>
                <Button onClick={handleNext} size="lg" className="px-8">
                  Get My Guide →
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <DialogHeader>
                <DialogTitle>Almost there! ✨</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send your personalized guide to this email
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('preview')}
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!isFormValid}
                  className="flex-1"
                >
                  Continue to Payment →
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Secure Payment
                </DialogTitle>
              </DialogHeader>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm">Personalized Travel Guide</span>
                    <span className="font-semibold">$12.00</span>
                  </div>
                  <div className="text-xs text-muted-foreground border-t pt-2">
                    To: {formData.email}
                  </div>
                </CardContent>
              </Card>

              {/* Stripe integration would go here */}
              <div className="bg-muted/50 p-4 rounded-lg text-center space-y-3">
                <CreditCard className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Secure payment powered by Stripe
                </p>
                <Button 
                  onClick={handleNext}
                  className="w-full"
                  size="lg"
                >
                  Pay $12 Securely
                </Button>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('details')}
                  className="flex-1"
                >
                  ← Back
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Successful! 🎉</h3>
                  <p className="text-sm text-muted-foreground">
                    Your personalized travel guide is being prepared and will be sent to <br/>
                    <span className="font-medium">{formData.email}</span> within 5 minutes.
                  </p>
                </div>
              </div>

              <Card>
                <CardContent className="p-4 text-left">
                  <h4 className="font-medium mb-2">What happens next?</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Your guide will arrive in your inbox shortly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Download the PDF or access it online anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Start planning your amazing journey!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={onClose} className="w-full" size="lg">
                Perfect! Let's Explore More →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}