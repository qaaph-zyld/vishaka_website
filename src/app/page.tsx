import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Moon, Sun, BookOpen, Users, Calculator } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <img
                  src="/logo.png"
                  alt="Vishaka Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Vishaka</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Vedic Astrology Wisdom</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/kundli" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Kundli</Link>
              <a href="#education" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Education</a>
              <a href="#masters" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Masters</a>
              <a href="#about" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Sidereal Vedic Astrology
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Discover Your Cosmic Blueprint
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Generate authentic Vedic Kundli reports using traditional sidereal calculations with Lahiri Ayanamsa. 
            Explore the ancient wisdom of Jyotish astrology with modern precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kundli">
              <Button size="lg" className="text-lg px-8">
                <Calculator className="mr-2 h-5 w-5" />
                Generate Your Kundli
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <BookOpen className="mr-2 h-5 w-5" />
              Learn Vedic Astrology
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 mx-auto bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle>Authentic Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Precise sidereal Vedic astrology calculations using Lahiri Ayanamsa, 
                following traditional Jyotish principles.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <Moon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Visual Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Beautiful, interactive Jyotish chart visualizations in both North 
                and South Indian styles with detailed interpretations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <Sun className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Ancient Wisdom</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Learn from authentic Vedic astrology teachings, with guidance from 
                respected masters and traditional scriptures.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white/50 dark:bg-slate-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              At Vishaka, we are committed to preserving and sharing the authentic wisdom of 
              Vedic astrology. We aim to provide accurate Kundli reports and educational 
              content that honors the traditional teachings while making them accessible 
              to modern seekers.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We respectfully acknowledge and guide students toward the great masters of 
              Vedic astrology, ensuring the continuation of this sacred knowledge for 
              future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8">
              <img
                src="/logo.png"
                alt="Vishaka Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Vishaka</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            © 2024 Vishaka. Preserving the ancient wisdom of Vedic astrology.
          </p>
        </div>
      </footer>
    </div>
  )
}