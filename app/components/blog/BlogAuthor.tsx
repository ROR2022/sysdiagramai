'use client';

import Link from 'next/link';
import BlogImage from './BlogImage';

interface BlogAuthorProps {
  name: string;
  avatar: string;
  role?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export default function BlogAuthor({ 
  name, 
  avatar, 
  role, 
  bio, 
  socialLinks 
}: BlogAuthorProps) {
  return (
    <div className="flex items-start gap-4 p-5 bg-base-200 rounded-lg">
      <div className="avatar">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <BlogImage
            src={avatar}
            alt={name}
            width={64}
            height={64}
          />
        </div>
      </div>
      
      <div className="flex-1">
        <h4 className="font-bold text-lg">{name}</h4>
        {role && <p className="text-sm text-base-content/70 mb-2">{role}</p>}
        {bio && <p className="text-sm mb-3">{bio}</p>}
        
        {socialLinks && (
          <div className="flex gap-2">
            {socialLinks.twitter && (
              <Link 
                href={socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-ghost"
                aria-label="Perfil de Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
            )}
            
            {socialLinks.linkedin && (
              <Link 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-ghost"
                aria-label="Perfil de LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
            )}
            
            {socialLinks.github && (
              <Link 
                href={socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm btn-ghost"
                aria-label="Perfil de GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
