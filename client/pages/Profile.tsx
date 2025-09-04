import { Edit, Share2, MoreHorizontal, Plus, BookOpen, ClipboardList, Clock, Trophy, Zap, Coins, GraduationCap, Globe, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";

export function Profile() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Top Status Bar */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            Available for work
          </div>
        </div>

        {/* Header Section */}
        <div className="relative mb-6">
          {/* Cover Image Placeholder */}
          <div className="h-48 bg-muted/30 rounded-lg mx-8 mb-4 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-6 bg-muted rounded"></div>
              <div className="h-8 w-6 bg-primary/20 rounded relative">
                <div className="absolute inset-1 bg-primary/40 rounded"></div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Add a cover image. We recommend 2288 x 512.</p>
            <Button variant="link" className="text-blue-600 p-0 h-auto">Upload file</Button>
          </div>

          {/* Profile Picture - İsmin tam üstünde, merkezi 'C' harfi ile hizalı */}
          <div className="absolute left-44 -bottom-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white grid place-items-center text-2xl font-bold border-4 border-background">
              S
            </div>
          </div>
        </div>

        {/* User Info Section - Profil fotoğrafının sağında */}
        <div className="ml-40 mb-6 pt-8">
          <div className="flex items-start justify-between max-w-6xl">
            {/* Sol taraf - İsim ve unvan */}
            <div className="ml-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Cenker Gültekin</h1>
              <p className="text-muted-foreground mb-4">Full-Stack Developer</p>
            </div>
            
            {/* Sağ taraf - Aksiyon butonları */}
            <div className="flex items-center gap-3 mr-8">
              <Button className="bg-primary hover:bg-primary/90">
                <Edit className="h-4 w-4 mr-2" />
                Edit profile
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats - Edit profile butonları ile aynı hizada */}
          <div className="flex justify-end max-w-6xl mr-8">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">0 followers • 0 following • 3 topics</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Profil fotoğrafının sol kenarıyla hizalı */}
        <div className="ml-44 mb-8">
          <div className="flex bg-muted/30 rounded-lg p-1 max-w-4xl">
            <Button variant="default" size="sm" className="rounded-md">
              About
            </Button>
            <Button variant="ghost" size="sm" className="rounded-md">
              Skill Graph
              <Badge variant="secondary" className="ml-2 text-xs">ux</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-md">
              Projects
            </Button>
            <Button variant="ghost" size="sm" className="rounded-md">
              Tutorials
            </Button>
            <Button variant="ghost" size="sm" className="rounded-md">
              Career
            </Button>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Summary</h2>
                <Button variant="link" className="text-primary p-0 h-auto">Add</Button>
              </div>
              <div className="bg-card border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Create a delightful summary that will help users get to know you</p>
              </div>
            </div>

            {/* Links Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Links</h2>
                <Button variant="link" className="text-primary p-0 h-auto">Add</Button>
              </div>
              <div className="bg-card border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Add all your portfolio and social links here</p>
              </div>
            </div>

            {/* Course Certificates Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Course certificates</h2>
                <Button variant="link" className="text-muted-foreground p-0 h-auto">Explore courses</Button>
              </div>
              <div className="bg-card border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Complete courses to build up your certificates</p>
              </div>
            </div>

            {/* Toolstack Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Toolstack</h2>
                <Button variant="link" className="text-primary p-0 h-auto">Add</Button>
              </div>
              <div className="bg-card border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Add your favorite tools and technologies</p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Achievements Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Achievements</h2>
                <Button variant="link" className="text-muted-foreground p-0 h-auto">Explore</Button>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center gap-2">
                    {/* Sol hexagon rozet */}
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-muted/60 rounded"></div>
                    </div>
                    {/* Orta hexagon rozet - aktif */}
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center relative">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    {/* Sağ hexagon rozet */}
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-muted/60 rounded"></div>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">Earn badges as you build your skills</p>
              </div>
            </div>

            {/* Your Activity Section */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Your activity</h2>
              <div className="bg-card border rounded-lg p-4">
                {/* Tabs */}
                <div className="flex gap-1 mb-4">
                  <Button variant="default" size="sm" className="flex-1">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Learning
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Globe className="h-4 w-4 mr-2" />
                    Community
                  </Button>
                </div>
                
                {/* Activity Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>Courses</span>
                    <span className="ml-auto font-semibold">0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Briefs</span>
                    <span className="ml-auto font-semibold">0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <span>Assessments</span>
                    <span className="ml-auto font-semibold">1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Hours</span>
                    <span className="ml-auto font-semibold">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Statistics</h2>
              <div className="bg-card border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <span>Total pixels</span>
                    <span className="ml-auto font-semibold">0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span>Current league</span>
                    <span className="ml-auto font-semibold">Quartz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span>Current streak</span>
                    <span className="ml-auto font-semibold">0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span>Best streak</span>
                    <span className="ml-auto font-semibold">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Join Date */}
            <div className="text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 bg-muted rounded-full"></div>
                <span>Joined Sep 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
