import Link from 'next/link'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { User, FileText, Search, ListMusic, Music, UserPlus, Link as LinkIcon, Disc, Clock, TrendingUp } from "lucide-react"

export default function SidebarNav() {
  return (
    <Card className="w-64 h-full bg-background">
      <CardContent className="p-6">
        <div className="space-y-6">
            <div>
                <CardTitle className="mb-2 text-primary">Account</CardTitle>
                <nav className="space-y-1">
                <Link 
                    href="/account/your-content" 
                    className="flex items-center space-x-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                    <FileText className="w-4 h-4" />
                    <span>Your content</span>
                </Link>
                <Link 
                    href="/account/keyword" 
                    className="flex items-center space-x-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                    <Search className="w-4 h-4" />
                    <span>Keyword</span>
                </Link>
                <Link 
                    href="/account/profile" 
                    className="flex items-center space-x-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                </Link>
                </nav>
            </div>

          {/* <div>
            <CardTitle className="mb-2">Library</CardTitle>
            <nav className="space-y-1">
              <Link href="/playlists" className="flex items-center space-x-2 text-sm hover:text-primary">
                <ListMusic className="w-4 h-4" />
                <span>Playlists</span>
              </Link>
              <Link href="/songs" className="flex items-center space-x-2 text-sm hover:text-primary">
                <Music className="w-4 h-4" />
                <span>Songs</span>
              </Link>
              <Link href="/made-for-you" className="flex items-center space-x-2 text-sm hover:text-primary">
                <UserPlus className="w-4 h-4" />
                <span>Made for You</span>
              </Link>
              <Link href="/artists" className="flex items-center space-x-2 text-sm hover:text-primary">
                <LinkIcon className="w-4 h-4" />
                <span>Artists</span>
              </Link>
              <Link href="/albums" className="flex items-center space-x-2 text-sm hover:text-primary">
                <Disc className="w-4 h-4" />
                <span>Albums</span>
              </Link>
            </nav>
          </div> */}

          {/* <div>
            <CardTitle className="mb-2">Playlists</CardTitle>
            <nav className="space-y-1">
              <Link href="/recently-added" className="flex items-center space-x-2 text-sm hover:text-primary">
                <Clock className="w-4 h-4" />
                <span>Recently Added</span>
              </Link>
              <Link href="/recently-played" className="flex items-center space-x-2 text-sm hover:text-primary">
                <Clock className="w-4 h-4" />
                <span>Recently Played</span>
              </Link>
              <Link href="/top-songs" className="flex items-center space-x-2 text-sm hover:text-primary">
                <TrendingUp className="w-4 h-4" />
                <span>Top Songs</span>
              </Link>
              <Link href="/top-albums" className="flex items-center space-x-2 text-sm hover:text-primary">
                <TrendingUp className="w-4 h-4" />
                <span>Top Albums</span>
              </Link>
            </nav>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}