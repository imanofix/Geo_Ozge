import { useContext, useState } from "react";
import { Link } from "wouter";
import { Map, Award, BookOpen, GraduationCap, Menu, User, Image, Crown } from "lucide-react";
import { UserContext } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Header() {
  const { user, avatars, achievements, changeAvatar } = useContext(UserContext);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  
  // Get the avatar URL for current user
  const getUserAvatarUrl = () => {
    if (!user?.avatar || !avatars) return null;
    const userAvatar = avatars.find(avatar => avatar.id === user.avatar);
    return userAvatar?.url || null;
  };

  // Get color based on user level
  const getLevelColor = (level: number) => {
    if (level >= 5) return "text-purple-600";
    if (level >= 4) return "text-indigo-600";
    if (level >= 3) return "text-blue-600";
    if (level >= 2) return "text-cyan-600";
    return "text-primary";
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center">
            <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">GeoOzge</h1>
          </a>
        </Link>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#flashcards" className="flex items-center font-heading text-gray-600 hover:text-primary transition">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>Flashcards</span>
          </a>
          <a href="#attractions" className="flex items-center font-heading text-gray-600 hover:text-primary transition">
            <Map className="h-4 w-4 mr-1" />
            <span>Attractions</span>
          </a>
          <a href="#quiz" className="flex items-center font-heading text-gray-600 hover:text-primary transition">
            <Award className="h-4 w-4 mr-1" />
            <span>Quiz</span>
          </a>
          <a href="#capitals-game" className="flex items-center font-heading text-gray-600 hover:text-primary transition">
            <Map className="h-4 w-4 mr-1" />
            <span>Find Capitals</span>
          </a>
          <a href="#capitals-test" className="flex items-center font-heading text-gray-600 hover:text-primary transition">
            <GraduationCap className="h-4 w-4 mr-1" />
            <span>Capitals Test</span>
          </a>
          
          {/* User Profile */}
          <div className="profile-container relative">
            <div
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary overflow-hidden shadow-md"
              onClick={() => setAvatarDialogOpen(true)}
            >
              {getUserAvatarUrl() ? (
                <img 
                  src={getUserAvatarUrl() || ""} 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center">
                  {user?.name.charAt(0) || "U"}
                </div>
              )}
            </div>
            
            <div className="profile-popup bg-white rounded-xl shadow-xl p-5 w-80">
              <div className="flex items-start space-x-4">
                <div 
                  className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary cursor-pointer"
                  onClick={() => setAvatarDialogOpen(true)}
                >
                  {getUserAvatarUrl() ? (
                    <img 
                      src={getUserAvatarUrl() || ""} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-xl">
                      {user?.name.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-gray-800">{user?.name || "User"}</h3>
                  <p className="text-xs text-gray-500">Member since {user?.joinDate || "Today"}</p>
                  
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium mr-1.5 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.title}</span>
                    <span className={`text-xs font-bold ${getLevelColor(user?.level || 1)}`}>Уровень {user?.level || 1}</span>
                  </div>
                </div>
              </div>
              
              {/* Level Progress Bar */}
              <div className="mt-4 mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Прогресс уровня</span>
                  <span className="font-medium">{user?.progress || 0}/100</span>
                </div>
                <Progress 
                  value={user?.progress || 0} 
                  className="h-2 bg-gray-100" 
                  indicatorClassName="bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              
              {/* Stats */}
              <div className="mt-4 space-y-3 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Всего очков:</span>
                  <span className="font-semibold text-primary">{user?.points || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Изучено карточек:</span>
                  <span className="font-semibold text-primary">{user?.cardsStudied || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Точность в викторине:</span>
                  <span className="font-semibold text-primary">{user?.accuracy || "0%"}</span>
                </div>
              </div>
              
              {/* Achievements */}
              {user?.achievements && user.achievements.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Достижения:</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.achievements.map((achievement, index) => (
                      <div 
                        key={index} 
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md flex items-center"
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
        
        <button className="md:hidden text-gray-500">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Avatar Selection Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Выберите аватар</DialogTitle>
            <DialogDescription>
              Персонализируйте свой профиль, выбрав аватар из доступных вариантов.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            {avatars?.map((avatar) => (
              <div 
                key={avatar.id}
                className={`
                  relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200
                  ${user?.unlockedAvatars.includes(avatar.id) 
                    ? 'opacity-100 hover:scale-105' 
                    : 'opacity-40 grayscale cursor-not-allowed'
                  }
                  ${user?.avatar === avatar.id ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
                onClick={() => {
                  if (user?.unlockedAvatars.includes(avatar.id)) {
                    changeAvatar(avatar.id);
                  }
                }}
              >
                <img 
                  src={avatar.url} 
                  alt={avatar.name} 
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {!user?.unlockedAvatars.includes(avatar.id) && (
                    <div className="bg-black/50 text-white text-xs p-1 rounded">
                      🔒 Заблокировано
                    </div>
                  )}
                </div>
                <div className="text-xs text-center py-1 bg-gray-100">
                  {avatar.name}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Продолжайте зарабатывать очки, чтобы разблокировать больше аватаров!
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
