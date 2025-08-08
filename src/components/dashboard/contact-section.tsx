"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Mail, Phone, Github, Linkedin, Globe } from "lucide-react"

interface ContactInfo {
  email: string
  tel: string
  social: {
    GitHub: {
      name: string
      url: string
      navbar: boolean
    }
    LinkedIn: {
      name: string
      url: string
      navbar: boolean
    }
    Portfolio: {
      name: string
      url: string
      navbar: boolean
    }
    email: {
      name: string
      url: string
      navbar: boolean
    }
  }
}

export function ContactSection() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "cbouzar2@gmail.com",
    tel: "+213 540 23 48 03",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/chihabbouzar",
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/chihab-bouzar-essaidi/",
        navbar: true,
      },
      Portfolio: {
        name: "Portfolio",
        url: "https://chihabbouzar-portfolio.vercel.app",
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:cbouzar2@gmail.com",
        navbar: false,
      },
    },
  })

  const handleSave = () => {
    // Here you would typically save to your backend/database
    console.log("Saving contact info:", contactInfo)
    // Show success toast
  }

  const updateSocialLink = (platform: keyof ContactInfo["social"], field: string, value: string | boolean) => {
    setContactInfo((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: {
          ...prev.social[platform],
          [field]: value,
        },
      },
    }))
  }

  const socialIcons = {
    GitHub: Github,
    LinkedIn: Linkedin,
    Portfolio: Globe,
    email: Mail,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Information</h1>
        <p className="text-muted-foreground">Manage your contact details and social media links.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Contact</CardTitle>
          <CardDescription>Your primary contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tel"
                  type="tel"
                  value={contactInfo.tel}
                  onChange={(e) => setContactInfo((prev) => ({ ...prev, tel: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Manage your social media presence and visibility in navigation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(contactInfo.social).map(([platform, info]) => {
            const Icon = socialIcons[platform as keyof typeof socialIcons]
            return (
              <div key={platform} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <h3 className="font-medium">{info.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`${platform}-navbar`} className="text-sm">
                      Show in navbar
                    </Label>
                    <Switch
                      id={`${platform}-navbar`}
                      checked={info.navbar}
                      onCheckedChange={(checked) =>
                        updateSocialLink(platform as keyof ContactInfo["social"], "navbar", checked)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${platform}-name`}>Display Name</Label>
                  <Input
                    id={`${platform}-name`}
                    value={info.name}
                    onChange={(e) => updateSocialLink(platform as keyof ContactInfo["social"], "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${platform}-url`}>URL</Label>
                  <Input
                    id={`${platform}-url`}
                    value={info.url}
                    onChange={(e) => updateSocialLink(platform as keyof ContactInfo["social"], "url", e.target.value)}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full md:w-auto">
        Save Contact Information
      </Button>
    </div>
  )
}
