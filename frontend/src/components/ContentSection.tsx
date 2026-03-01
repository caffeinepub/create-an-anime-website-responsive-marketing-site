import React from 'react';
import { SectionHeader } from './SectionHeader';
import { useGetAllContents } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const CONTENT_TYPE_LABELS: Record<string, string> = {
  announcement: 'Announcement',
  lore: 'Lore',
  news: 'News',
  update: 'Update',
  blog: 'Blog',
};

export function ContentSection() {
  const { data: contents, isLoading, isError } = useGetAllContents();

  return (
    <section id="content" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader title="News & Updates" />

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-foreground/10 rounded-lg p-6 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-16 text-foreground/50 max-w-6xl mx-auto">
            <p className="text-lg">Failed to load updates. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && (!contents || contents.length === 0) && (
          <div className="text-center py-16 text-foreground/50 max-w-6xl mx-auto">
            <p className="text-lg italic">No updates have been posted yet.</p>
            <p className="text-sm mt-2">Check back soon for news and lore updates.</p>
          </div>
        )}

        {!isLoading && !isError && contents && contents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {contents.map((item) => (
              <article
                key={item.id}
                className="bg-card border border-foreground/20 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300 flex flex-col"
              >
                {item.imageUrl && (
                  <div className="w-full h-44 overflow-hidden bg-foreground/5">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs uppercase tracking-wider border-accent/40 text-accent">
                      {CONTENT_TYPE_LABELS[item.contentType] ?? item.contentType}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed flex-1 line-clamp-5">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
