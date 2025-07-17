import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Edit } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

interface UserProfileButtonProps {
  userData: {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
  };
}

export const UserProfileButton = ({ userData }: UserProfileButtonProps) => {
  const initials = `${userData.firstName?.charAt(0) || ""}${
    userData.lastName?.charAt(0) || ""
  }`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userData.profilePhoto} alt={userData.firstName} />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-white/95 backdrop-blur-md border-pink-100"
        align="end"
      >
        <div className="flex items-center gap-2 p-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userData.profilePhoto} alt={userData.firstName} />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            {/* <p className="text-sm font-medium">{userData.firstName} {userData.lastName}</p> */}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <Link href="/profile" className="flex items-center gap-2">
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2">
          <Edit className="w-4 h-4" />
          <Link href="/profile/edit" className="flex items-center gap-2">
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2 text-red-600 hover:text-red-700">
          <LogOut className="w-4 h-4" />
          <SignOutButton>
            <button className="flex items-center gap-2 text-sm text-red-600 cursor-pointer">
              <span>Sign Out</span>
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
