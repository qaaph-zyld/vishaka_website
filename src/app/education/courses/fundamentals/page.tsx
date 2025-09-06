"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  PlayCircle, 
  Clock, 
  Users, 
  Star, 
  CheckCircle,
  FileText,
  Video,
  Headphones,
  Download,
  ArrowLeft,
  User,
  Certificate,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
  completed: boolean;
  locked: boolean;
  order: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  order: number;
}

const modules: Module[] = [
  {
    id: '1',
    title: 'Introduction to Vedic Astrology',
    description: 'Learn the foundations and history of Vedic astrology',
    duration: '2 hours',
    order: 1,
    lessons: [
      {
        id: '1-1',
        title: 'What is Vedic Astrology?',
        description: 'Understanding the origins and significance of Jyotish',
        duration: '15 min',
        type: 'video',
        completed: false,
        locked: false,
        order: 1
      },
      {
        id: '1-2',
        title: 'History and Evolution',
        description: 'From ancient Vedas to modern practice',
        duration: '20 min',
        type: 'video',
        completed: false,
        locked: false,
        order: 2
      },
      {
        id: '1-3',
        title: 'Vedic vs Western Astrology',
        description: 'Key differences and philosophical foundations',
        duration: '25 min',
        type: 'text',
        completed: false,
        locked: false,
        order: 3
      },
      {
        id: '1-4',
        title: 'Module 1 Quiz',
        description: 'Test your understanding of the basics',
        duration: '10 min',
        type: 'quiz',
        completed: false,
        locked: false,
        order: 4
      }
    ]
  },
  {
    id: '2',
    title: 'The Zodiac and Signs',
    description: 'Deep dive into the 12 Rashis and their characteristics',
    duration: '3 hours',
    order: 2,
    lessons: [
      {
        id: '2-1',
        title: 'Understanding the 12 Signs',
        description: 'Overview of all Rashis and their elements',
        duration: '30 min',
        type: 'video',
        completed: false,
        locked: true,
        order: 1
      },
      {
        id: '2-2',
        title: 'Fire Signs (Aries, Leo, Sagittarius)',
        description: 'Characteristics and traits of fire signs',
        duration: '25 min',
        type: 'video',
        completed: false,
        locked: true,
        order: 2
      },
      {
        id: '2-3',
        title: 'Earth Signs (Taurus, Virgo, Capricorn)',
        description: 'Understanding earth element signs',
        duration: '25 min',
        type: 'video',
        completed: false,
        locked: true,
        order: 3
      },
      {
        id: '2-4',
        title: 'Air Signs (Gemini, Libra, Aquarius)',
        description: 'Characteristics of air element signs',
        duration: '25 min',
        type: 'video',
        completed: false,
        locked: true,
        order: 4
      },
      {
        id: '2-5',
        title: 'Water Signs (Cancer, Scorpio, Pisces)',
        description: 'Understanding water element signs',
        duration: '25 min',
        type: 'video',
        completed: false,
        locked: true,
        order: 5
      },
      {
        id: '2-6',
        title: 'Module 2 Quiz',
        description: 'Test your knowledge of zodiac signs',
        duration: '15 min',
        type: 'quiz',
        completed: false,
        locked: true,
        order: 6
      }
    ]
  },
  {
    id: '3',
    title: 'The Nine Planets (Grahas)',
    description: 'Comprehensive study of Navagrahas and their influences',
    duration: '4 hours',
    order: 3,
    lessons: [
      {
        id: '3-1',
        title: 'Introduction to Grahas',
        description: 'Understanding the nine celestial bodies',
        duration: '20 min',
        type: 'video',
        completed: false,
        locked: true,
        order: 1
      },
      {
        id: '3-2',
        title: 'Sun (Surya) - The Soul',
        description: 'Significance and characteristics of the Sun',
        duration: '30 min',
        type: 'video',
        completed: false,
        locked: true,
        order: 2
      },
      {
        id: '3-3',
        title: 'Moon (Chandra) - The Mind',
        description: 'Understanding lunar influences',
        duration: '30 min',
        type: 'video',
        completed: false,
        locked: true,
        order: 3
      }
    ]
  }
];

const courseData = {
  id: '1',
  title: 'Fundamentals of Vedic Astrology',
  description: 'Learn the basic principles, concepts, and foundations of Vedic astrology including planets, signs, houses, and their meanings.',
  instructor: 'Dr. Vedant Sharma',
  instructorTitle: 'PhD in Vedic Astrology',
  rating: 4.8,
  students: 15420,
  duration: '8 weeks',
  lessons: 24,
  category: 'foundations',
  level: 'beginner',
  price: 'free',
  tags: ['basics', 'planets', 'signs', 'houses'],
  learningOutcomes: [
    'Understand the fundamental concepts of Vedic astrology',
    'Identify and interpret the 12 zodiac signs and their characteristics',
    'Learn about the nine planets and their significations',
    'Understand the 12 houses and their meanings',
    'Calculate and interpret basic birth charts',
    'Apply Vedic principles to real-life situations'
  ],
  requirements: [
    'No prior knowledge of astrology required',
    'Basic understanding of mathematics helpful but not necessary',
    'Open mind and willingness to learn ancient wisdom'
  ]
};

export default function CoursePage() {
  const [activeModule, setActiveModule] = useState(modules[0].id);
  const [progress, setProgress] = useState(0);

  const completedLessons = modules.flatMap(module => module.lessons).filter(lesson => lesson.completed).length;
  const totalLessons = modules.flatMap(module => module.lessons).length;
  const currentProgress = Math.round((completedLessons / totalLessons) * 100);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/education" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Courses</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8">
                <img
                  src="/logo.png"
                  alt="Vishaka Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Vishaka</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Vedic Astrology Wisdom</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{courseData.category}</Badge>
                      <Badge variant="secondary">{courseData.level}</Badge>
                      {courseData.price === 'free' && (
                        <Badge className="bg-green-100 text-green-800">FREE</Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                      {courseData.title}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                      {courseData.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{courseData.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="h-4 w-4" />
                        <span>{courseData.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{courseData.students.toLocaleString()} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{courseData.rating} rating</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Course Progress</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {completedLessons}/{totalLessons} lessons completed
                    </span>
                  </div>
                  <Progress value={currentProgress} className="h-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {currentProgress}% complete
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button size="lg" className="flex-1">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Continue Learning
                  </Button>
                  <Button variant="outline" size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Resources
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {modules.length} modules • {totalLessons} lessons • {courseData.duration} total length
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeModule} onValueChange={setActiveModule}>
                  <TabsList className="grid w-full grid-cols-3">
                    {modules.slice(0, 3).map((module) => (
                      <TabsTrigger key={module.id} value={module.id} className="text-xs">
                        {module.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {modules.map((module) => (
                    <TabsContent key={module.id} value={module.id} className="mt-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                          {module.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                          <span>{module.lessons.length} lessons</span>
                          <span>{module.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                              lesson.completed
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : lesson.locked
                                ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                {lesson.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : lesson.locked ? (
                                  <div className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(lesson.type)}
                                <div>
                                  <h4 className="font-medium text-sm">{lesson.title}</h4>
                                  <p className="text-xs text-slate-600 dark:text-slate-400">
                                    {lesson.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {lesson.duration}
                              </span>
                              {lesson.locked ? (
                                <Badge variant="outline" className="text-xs">Locked</Badge>
                              ) : (
                                <Button size="sm" variant="outline" className="text-xs">
                                  {lesson.completed ? 'Review' : 'Start'}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    VS
                  </div>
                  <div>
                    <h4 className="font-semibold">{courseData.instructor}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {courseData.instructorTitle}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Dr. Vedant Sharma has been practicing Vedic astrology for over 20 years and holds a PhD in 
                  Vedic Astrology from Banaras Hindu University. He specializes in predictive astrology 
                  and has guided thousands of students worldwide.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Instructor
                </Button>
              </CardContent>
            </Card>

            {/* Learning Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {courseData.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {courseData.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      </div>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Certificate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Certificate className="h-5 w-5" />
                  <span>Certificate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Get a verified certificate upon completion of this course.
                </p>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Certificate className="h-5 w-5 text-amber-600" />
                    <span className="font-medium text-amber-800 dark:text-amber-200">
                      Certificate of Completion
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Shareable on LinkedIn and professional profiles
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}