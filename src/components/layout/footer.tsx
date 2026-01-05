import { Dumbbell, Twitter, Github, Linkedin, Lock, Building } from "lucide-react";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background relative">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] rounded-md p-1 text-white" />
            <span className="font-bold text-lg">Spordate</span>
          </div>
          <div className="text-center text-sm text-foreground/60">
            <Link href="/admin/login" className="hover:text-foreground transition-colors" title="Admin Access">
                © {new Date().getFullYear()} Spordate.
            </Link>
             {' '}All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="text-foreground/60 hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
               <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
