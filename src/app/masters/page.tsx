"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Star, 
  Users, 
  Calendar, 
  Award,
  ExternalLink,
  Quote,
  Video,
  FileText,
  Globe,
  Mail,
  Youtube,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface Master {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  website: string;
  expertise: string[];
  achievements: string[];
  books: Array<{
    title: string;
    year: string;
    description: string;
  }>;
  teachings: string[];
  quotes: string[];
  contributions: string[];
  socialLinks: {
    website?: string;
    youtube?: string;
    email?: string;
  };
}

const masters: Master[] = [
  {
    id: 'sanjay-rath',
    name: 'Pundit Sanjay Rath',
    title: 'Founder of Sri Jagannath Center',
    description: 'A world-renowned authority on Vedic astrology and author of numerous books on Jyotish. Pundit Rath is known for his deep knowledge of classical texts and practical approach to astrology.',
    avatar: 'SR',
    website: 'https://srath.com',
    expertise: [
      'Jaimini Astrology',
      'Parashara System',
      'Nakshatra Astrology',
      'Remedial Measures',
      'Predictive Techniques',
      'Classical Texts'
    ],
    achievements: [
      'Founded Sri Jagannath Center for Vedic Astrology',
      'Authored 15+ books on Vedic astrology',
      'Taught over 10,000 students worldwide',
      'Revived ancient Jaimini system of astrology',
      'Developed unique predictive techniques',
      'Regular speaker at international conferences'
    ],
    books: [
      {
        title: 'Vedic Astrology: An Integrated Approach',
        year: '2001',
        description: 'A comprehensive guide to Vedic astrology principles and practices'
      },
      {
        title: 'Crux of Vedic Astrology',
        year: '2004',
        description: 'Essential concepts and techniques in predictive astrology'
      },
      {
        title: 'Jaimini Sutras',
        year: '2007',
        description: 'Translation and commentary on the ancient Jaimini Sutras'
      },
      {
        title: 'Nakshatra: The Lunar Mansions',
        year: '2010',
        description: 'Deep exploration of Nakshatra astrology and its applications'
      }
    ],
    teachings: [
      'Emphasis on classical texts and traditional methods',
      'Integration of Parashara and Jaimini systems',
      'Practical application of astrological principles',
      'Importance of spiritual growth alongside astrological knowledge',
      'Ethical practice and responsible use of astrology'
    ],
    quotes: [
      'Astrology is the light of God and the supreme knowledge.',
      'The purpose of astrology is to guide people towards their spiritual destiny.',
      'A good astrologer must be a good human being first.',
      'The stars impel but do not compel - we have free will.',
      'Vedic astrology is a tool for self-realization and spiritual growth.'
    ],
    contributions: [
      'Revived interest in classical Vedic astrology',
      'Made complex astrological concepts accessible to modern students',
      'Developed systematic teaching methodologies',
      'Preserved and interpreted ancient astrological texts',
      'Trained a new generation of qualified Vedic astrologers'
    ],
    socialLinks: {
      website: 'https://srath.com',
      youtube: 'https://youtube.com/@srijagannathcenter',
      email: 'contact@srath.com'
    }
  },
  {
    id: 'deepanshu-giri',
    name: 'Deepanshu Giri',
    title: 'Founder of Lunar Astro',
    description: 'A popular educator and practitioner known for making Vedic astrology accessible to modern audiences. Deepanshu combines traditional knowledge with contemporary teaching methods.',
    avatar: 'DG',
    website: 'https://lunarastro.com',
    expertise: [
      'Practical Astrology',
      'Career Guidance',
      'Marriage Matching',
      'Remedial Astrology',
      'Numerology',
      'Vastu Shastra'
    ],
    achievements: [
      'Founded Lunar Astro - leading astrology education platform',
      'Educated over 100,000 students through online courses',
      'Created 500+ hours of educational content',
      'Regular YouTube channel with millions of views',
      'Developed simplified teaching methodologies',
      'Organized numerous astrology workshops and seminars'
    ],
    books: [
      {
        title: 'Practical Vedic Astrology',
        year: '2018',
        description: 'A beginner-friendly guide to understanding and applying Vedic astrology'
      },
      {
        title: 'Career Astrology: Finding Your True Calling',
        year: '2019',
        description: 'Using astrology to discover your ideal career path and professional success'
      },
      {
        title: 'Marriage and Relationships in Vedic Astrology',
        year: '2020',
        description: 'Comprehensive guide to relationship compatibility and timing'
      },
      {
        title: 'Remedial Measures in Vedic Astrology',
        year: '2021',
        description: 'Practical solutions for planetary afflictions and life challenges'
      }
    ],
    teachings: [
      'Simplification of complex astrological concepts',
      'Focus on practical application in daily life',
      'Integration of multiple astrological systems',
      'Emphasis on ethical and responsible practice',
      'Making ancient knowledge accessible to modern audiences'
    ],
    quotes: [
      'Astrology is not about fate, it\'s about opportunity.',
      'Knowledge without application is merely entertainment.',
      'The planets show the way, but we walk the path.',
      'Astrology should empower, not paralyze.',
      'Modern problems need ancient solutions with contemporary understanding.'
    ],
    contributions: [
      'Democratized Vedic astrology education',
      'Created engaging and accessible learning content',
      'Bridged gap between traditional and modern approaches',
      'Built a large community of astrology enthusiasts',
      'Made astrology education affordable and accessible'
    ],
    socialLinks: {
      website: 'https://lunarastro.com',
      youtube: 'https://youtube.com/@lunarastro',
      email: 'support@lunarastro.com'
    }
  }
];

export default function MastersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
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
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/kundli" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Kundli</Link>
              <Link href="/education" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Education</Link>
              <Link href="/masters" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 font-medium">Masters</Link>
              <Link href="/about" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">About</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Star className="mr-2 h-4 w-4" />
            Vedic Astrology Masters
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Learn from the Great Masters
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            At Vishaka, we deeply respect and honor the great masters of Vedic astrology. 
            Their wisdom, dedication, and contributions have preserved and enriched this ancient knowledge for future generations.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We encourage all students to learn directly from these authentic sources and support their work.
          </p>
        </div>

        {/* Masters Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {masters.map((master) => (
            <Card key={master.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {master.avatar}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{master.name}</h3>
                    <p className="text-indigo-100">{master.title}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Globe className="h-3 w-3 mr-1" />
                        Website
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Users className="h-3 w-3 mr-1" />
                        Teacher
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {master.description}
                </p>

                {/* Expertise */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {master.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-purple-500" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-1">
                    {master.achievements.slice(0, 3).map((achievement, index) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                        <ChevronRight className="h-3 w-3 mt-1 mr-2 flex-shrink-0 text-slate-400" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Featured Quote */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg mb-6">
                  <div className="flex items-start space-x-3">
                    <Quote className="h-5 w-5 text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm italic text-slate-600 dark:text-slate-400">
                        "{master.quotes[0]}"
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        - {master.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button size="sm" className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Books
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Master Profiles */}
        <div className="space-y-16">
          {masters.map((master) => (
            <div key={master.id} className="scroll-mt-16" id={master.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {master.avatar}
                    </div>
                    <div>
                      {master.name}
                      <p className="text-lg font-normal text-slate-600 dark:text-slate-400">
                        {master.title}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About {master.name.split(' ')[0]}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {master.description} Their work has significantly influenced the way Vedic astrology is practiced and taught in the modern world. 
                      Through their dedication to authentic teachings and innovative approaches, they have inspired countless students to 
                      pursue the path of Vedic astrology with sincerity and dedication.
                    </p>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Books */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                        Notable Publications
                      </h3>
                      <div className="space-y-4">
                        {master.books.map((book, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-medium">{book.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                              {book.description}
                            </p>
                            <p className="text-xs text-slate-500">Published: {book.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Teachings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Video className="h-5 w-5 mr-2 text-green-500" />
                        Teachings & Philosophy
                      </h3>
                      <div className="space-y-3">
                        {master.teachings.map((teaching, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {teaching}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quotes */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Quote className="h-5 w-5 mr-2 text-purple-500" />
                      Inspirational Quotes
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {master.quotes.slice(1).map((quote, index) => (
                        <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-sm italic text-slate-700 dark:text-slate-300">
                            "{quote}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contributions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-amber-500" />
                      Contributions to Vedic Astrology
                    </h3>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                      <ul className="space-y-2">
                        {master.contributions.map((contribution, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {contribution}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold mb-3">Learn from {master.name.split(' ')[0]}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      We encourage all students to learn directly from these masters. Visit their websites, 
                      attend their workshops, and study their books to gain authentic knowledge of Vedic astrology.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm">
                        <Globe className="mr-2 h-4 w-4" />
                        Visit {master.name.split(' ')[0]}'s Website
                      </Button>
                      <Button variant="outline" size="sm">
                        <Youtube className="mr-2 h-4 w-4" />
                        Watch Videos
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Our Commitment to Authentic Learning</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
                At Vishaka, we are committed to preserving and sharing the authentic wisdom of Vedic astrology. 
                While we provide tools and education, we believe that the true depth of this knowledge comes from 
                learning directly from experienced masters and practitioners.
              </p>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                We humbly acknowledge the contributions of great masters like Pundit Sanjay Rath and Deepanshu Giri, 
                and we encourage all students to support their work and learn from their wisdom.
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <Button size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
                <Button variant="outline" size="lg">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Explore Resources
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}