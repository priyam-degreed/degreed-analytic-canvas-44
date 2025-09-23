import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: 'user' | 'group';
}

interface ShareDashboardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardName: string;
}

// Mock users and groups data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Omkar Guruju",
    email: "oguruju@degreed.com",
    avatar: "/api/placeholder/32/32",
    type: "user"
  },
  {
    id: "2", 
    name: "Tatiana Oka",
    email: "toka@degreed.com",
    type: "user"
  },
  {
    id: "3",
    name: "Marketing Team",
    email: "marketing@company.com",
    type: "group"
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    type: "user"
  },
  {
    id: "5",
    name: "Data Analytics Group",
    email: "analytics@company.com", 
    type: "group"
  }
];

export function ShareDashboardDialog({ isOpen, onClose, dashboardName }: ShareDashboardDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery]);

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find(selected => selected.id === user.id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setSearchQuery("");
    setFilteredUsers([]);
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleShare = () => {
    // Implement share functionality here
    console.log("Sharing dashboard with:", selectedUsers);
    onClose();
    // Reset state
    setSelectedUsers([]);
    setSearchQuery("");
    setFilteredUsers([]);
  };

  const handleCancel = () => {
    onClose();
    // Reset state
    setSelectedUsers([]);
    setSearchQuery("");
    setFilteredUsers([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Share {dashboardName}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="share-search" className="text-sm font-medium text-gray-700">
                To:
              </label>
              <span className="text-sm text-gray-500">Required</span>
            </div>
            
            <div className="relative">
              <Input
                id="share-search"
                type="text"
                placeholder="Search users or groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              
              {/* Search Results Dropdown */}
              {filteredUsers.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gray-100">
                          {user.type === 'group' ? (
                            <Users className="h-4 w-4 text-gray-600" />
                          ) : (
                            <User className="h-4 w-4 text-gray-600" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {user.email}
                        </div>
                      </div>
                      {user.type === 'group' && (
                        <Badge variant="secondary" className="text-xs">
                          Group
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 last:border-b-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gray-100">
                      {user.type === 'group' ? (
                        <Users className="h-4 w-4 text-gray-600" />
                      ) : (
                        <User className="h-4 w-4 text-gray-600" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                  {user.type === 'group' && (
                    <Badge variant="secondary" className="text-xs">
                      Group
                    </Badge>
                  )}
                  <button
                    onClick={() => handleUserRemove(user.id)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={selectedUsers.length === 0}
            className={cn(
              "bg-blue-500 hover:bg-blue-600 text-white",
              selectedUsers.length === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            Share with {selectedUsers.length} {selectedUsers.length === 1 ? 'person' : 'people'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}