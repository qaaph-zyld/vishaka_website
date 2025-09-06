"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  ChevronRight,
  User,
  Calendar,
  PlayCircle,
  FileText,
  Video,
  Headphones
} from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  instructor: string;
  rating: number;
  students: number;
  price: 'free' | number;
  tags: string[];
  featured: boolean;
  instructorTitle: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  tags: string[];
  featured: boolean;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Fundamentals of Vedic Astrology',
    description: 'Learn the basic principles, concepts, and foundations of Vedic astrology including planets, signs, houses, and their meanings.',
    category: 'foundations',
    level: 'beginner',
    duration: '8 weeks',
    lessons: 24,
    instructor: 'Dr. Vedant Sharma',
    rating: 4.8,
    students: 15420,
    price: 'free',
    tags: ['basics', 'planets', 'signs', 'houses'],
    featured: true,
    instructorTitle: 'PhD in Vedic Astrology'
  },
  {
    id: '2',
    title: 'Planetary Periods (Dasha) System',
    description: 'Master the art of timing events through the Vedic Dasha system including Vimshottari Dasha and its applications.',
    category: 'predictive',
    level: 'intermediate',
    duration: '6 weeks',
    lessons: 18,
    instructor: 'Smt. Priya Desai',
    rating: 4.9,
    students: 8750,
    price: 49,
    tags: ['dasha', 'timing', 'prediction', 'vimshottari'],
    featured: true,
    instructorTitle: 'Jyotish Visharada'
  },
  {
    id: '3',
    title: 'Marriage and Relationship Astrology',
    description: 'Comprehensive study of relationship compatibility, marriage timing, and relationship analysis through Vedic principles.',
    category: 'specialized',
    level: 'intermediate',
    duration: '10 weeks',
    lessons: 30,
    instructor: 'Pt. Ramesh Iyer',
    rating: 4.7,
    students: 6540,
    price: 79,
    tags: ['marriage', 'relationships', 'compatibility', '7th house'],
    featured: false,
    instructorTitle: 'Vedic Astrology Scholar'
  },
  {
    id: '4',
    title: 'Medical Astrology and Healing',
    description: 'Explore the connection between planetary positions and health, learn to identify potential health issues and remedies.',
    category: 'specialized',
    level: 'advanced',
    duration: '12 weeks',
    lessons: 36,
    instructor: 'Dr. Anjali Gupta',
    rating: 4.6,
    students: 4320,
    price: 99,
    tags: ['health', 'medical', 'remedies', '6th house'],
    featured: false,
    instructorTitle: 'MD (Ayurveda), Jyotish Expert'
  },
  {
    id: '5',
    title: 'Nakshatra Wisdom - The Lunar Mansions',
    description: 'Deep dive into the 27 Nakshatras, their mythology, characteristics, and profound influence on human life.',
    category: 'foundations',
    level: 'intermediate',
    duration: '8 weeks',
    lessons: 24,
    instructor: 'Dr. Rajesh Kumar',
    rating: 4.9,
    students: 9200,
    price: 69,
    tags: ['nakshatras', 'moon', 'mythology', 'characteristics'],
    featured: true,
    instructorTitle: 'Nakshatra Specialist'
  },
  {
    id: '6',
    title: 'Vedic Remedies and Upayas',
    description: 'Learn authentic Vedic remedies including mantras, gemstones, yantras, and rituals for planetary afflictions.',
    category: 'remedies',
    level: 'intermediate',
    duration: '4 weeks',
    lessons: 12,
    instructor: 'Guruji Venkatraman',
    rating: 4.8,
    students: 7800,
    price: 59,
    tags: ['remedies', 'mantras', 'gemstones', 'rituals'],
    featured: false,
    instructorTitle: 'Spiritual Guide'
  }
];

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding the Significance of Lagna (Ascendant) in Vedic Astrology',
    excerpt: 'The ascendant or Lagna is the foundation of Vedic astrology. Learn how it shapes your personality, life path, and destiny.',
    category: 'foundations',
    readTime: '8 min read',
    author: 'Dr. Vedant Sharma',
    date: '2024-01-15',
    tags: ['lagna', 'ascendant', 'personality', 'foundations'],
    featured: true
  },
  {
    id: '2',
    title: 'The Role of Saturn in Spiritual Growth and Karma',
    excerpt: 'Saturn, the great teacher, plays a crucial role in our spiritual evolution. Discover how Saturn\'s placement influences your karmic journey.',
    category: 'planets',
    readTime: '12 min read',
    author: 'Smt. Priya Desai',
    date: '2024-01-12',
    tags: ['saturn', 'karma', 'spirituality', 'lessons'],
    featured: true
  },
  {
    id: '3',
    title: 'Navamsa Chart: The Key to Understanding Marriage and Relationships',
    excerpt: 'The Navamsa D9 chart is essential for analyzing relationships and marriage potential. Learn to interpret this important divisional chart.',
    category: 'charts',
    readTime: '10 min read',
    author: 'Pt. Ramesh Iyer',
    date: '2024-01-10',
    tags: ['navamsa', 'marriage', 'relationships', 'D9'],
    featured: false
  },
  {
    id: '4',
    title: 'The Power of Mantras in Vedic Astrology Remedies',
    excerpt: 'Mantras are powerful tools for transformation and healing. Understand the science behind mantras and their astrological applications.',
    category: 'remedies',
    readTime: '6 min read',
    author: 'Guruji Venkatraman',
    date: '2024-01-08',
    tags: ['mantras', 'remedies', 'healing', 'sound'],
    featured: false
  },
  {
    id: '5',
    title: 'Introduction to Jaimini Astrology System',
    excerpt: 'Explore the unique Jaimini system of Vedic astrology with its special karakas, aspects, and predictive techniques.',
    category: 'systems',
    readTime: '15 min read',
    author: 'Dr. Rajesh Kumar',
    date: '2024-01-05',
    tags: ['jaimini', 'karakas', 'aspects', 'prediction'],
    featured: false
  },
  {
    id: '6',
    title: 'The Moon and Emotional Intelligence in Vedic Astrology',
    excerpt: 'The Moon represents our mind and emotions. Learn how lunar placement affects emotional intelligence and mental well-being.',
    category: 'planets',
    readTime: '9 min read',
    author: 'Dr. Anjali Gupta',
    date: '2024-01-03',
    tags: ['moon', 'emotions', 'mind', 'psychology'],
    featured: false
  }
];

const categories = [
  { id: 'all', name: 'All Content', count: 12 },
  { id: 'foundations', name: 'Foundations', count: 3 },
  { id: 'predictive', name: 'Predictive', count: 1 },
  { id: 'specialized', name: 'Specialized', count: 2 },
  { id: 'remedies', name: 'Remedies', count: 1 },
  { id: 'planets', name: 'Planets', count: 2 },
  { id: 'charts', name: 'Charts', count: 1 },
  { id: 'systems', name: 'Systems', count: 1 }
];

const levels = [
  { id: 'all', name: 'All Levels' },
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' }
];

export default function EducationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [activeTab, setActiveTab] = useState<'courses' | 'articles'>('courses');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const filteredArticles = blogPosts.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredCourses = courses.filter(course => course.featured);
  const featuredArticles = blogPosts.filter(article => article.featured);

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
              <Link href="/education" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 font-medium">Education</Link>
              <Link href="/masters" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">Masters</Link>
              <Link href="/about" className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">About</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="mr-2 h-4 w-4" />
            Vedic Astrology Academy
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Master the Ancient Wisdom of Vedic Astrology
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Learn authentic Vedic astrology from experienced practitioners. Our comprehensive courses and articles 
            are designed to take you from beginner to expert level with traditional knowledge and modern applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <FileText className="mr-2 h-5 w-5" />
              Read Articles
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">6+</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Expert Courses</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Students Enrolled</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Learning Articles</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Access to Content</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Content */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Featured Content</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Featured Course */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <Badge variant="secondary" className="bg-white/20 text-white mb-2">
                  Featured Course
                </Badge>
                <h3 className="text-xl font-bold mb-2">Fundamentals of Vedic Astrology</h3>
                <p className="text-blue-100 mb-4">Perfect starting point for your Vedic astrology journey</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>8 weeks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>15,420 students</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Dr. Vedant Sharma</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">PhD in Vedic Astrology</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">4.8</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Rating</p>
                  </div>
                </div>
                <Button className="w-full">Enroll for Free</Button>
              </CardContent>
            </Card>

            {/* Featured Article */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
                <Badge variant="secondary" className="bg-white/20 text-white mb-2">
                  Featured Article
                </Badge>
                <h3 className="text-xl font-bold mb-2">Understanding the Significance of Lagna</h3>
                <p className="text-green-100 mb-4">The foundation of Vedic astrology and personality analysis</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>8 min read</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Jan 15, 2024</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  The ascendant or Lagna is the foundation of Vedic astrology. It represents the eastern horizon at the time of birth and determines the starting point of the birth chart...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">Dr. Vedant Sharma</span>
                  </div>
                  <Button variant="outline">Read Article</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search courses, articles, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'courses'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Courses ({filteredCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'articles'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Articles ({filteredArticles.length})
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {activeTab === 'courses' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {course.featured && (
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1">
                    <p className="text-xs font-medium text-white">FEATURED</p>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline">{course.category}</Badge>
                    <Badge 
                      variant={course.level === 'beginner' ? 'secondary' : course.level === 'intermediate' ? 'default' : 'destructive'}
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="h-4 w-4 text-slate-500" />
                        <span>{course.lessons} lessons</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {course.price === 'free' ? (
                        <Badge variant="secondary" className="text-green-600">FREE</Badge>
                      ) : (
                        <span className="text-lg font-bold">${course.price}</span>
                      )}
                    </div>
                    <Button size="sm">
                      {course.price === 'free' ? 'Enroll Now' : 'View Details'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {article.featured && (
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 px-3 py-1">
                    <p className="text-xs font-medium text-white">FEATURED</p>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-xs text-slate-500">{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{article.author}</p>
                        <p className="text-xs text-slate-500">{article.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Read More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Masters Reference */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Learn from the Great Masters
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We respect and acknowledge the great masters of Vedic astrology. Our curriculum is inspired by their teachings 
              and we encourage students to study directly from these authentic sources.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    SR
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-1">Pundit Sanjay Rath</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Founder of Sri Jagannath Center and renowned authority on Jaimini Astrology
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">Jaimini Astrology</Badge>
                      <Badge variant="secondary" className="text-xs">Parashara</Badge>
                      <Badge variant="secondary" className="text-xs">Jyotish Guru</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Visit srath.com →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    DG
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-1">Deepanshu Giri</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Founder of Lunar Astro and popular educator in Vedic astrology
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">Practical Astrology</Badge>
                      <Badge variant="secondary" className="text-xs">Modern Teaching</Badge>
                      <Badge variant="secondary" className="text-xs">Research</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Visit lunarastro.com →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}