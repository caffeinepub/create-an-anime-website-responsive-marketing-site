import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useGetAllContents } from "../hooks/useQueries";
import { SectionHeader } from "./SectionHeader";

const CONTENT_TYPE_LABELS: Record<string, string> = {
  announcement: "Announcement",
  lore: "Lore",
  news: "News",
  update: "Update",
  blog: "Blog",
};

const OLIVE_ACCENT = "oklch(0.65 0.12 130)";
const OLIVE_BG = "oklch(0.13 0.04 130)";
const OLIVE_CARD = "oklch(0.17 0.04 130)";

export function ContentSection() {
  const { data: contents, isLoading, isError } = useGetAllContents();

  return (
    <section
      id="content"
      data-ocid="content.section"
      className="py-20"
      style={{ backgroundColor: OLIVE_BG }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader title="News & Updates" accentColor={OLIVE_ACCENT} />

        {isLoading && (
          <div
            data-ocid="content.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8"
          >
            {["a", "b", "c"].map((id) => (
              <div
                key={id}
                className="rounded-lg p-6 space-y-3"
                style={{
                  backgroundColor: OLIVE_CARD,
                  border: `1px solid ${OLIVE_ACCENT}20`,
                }}
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div
            data-ocid="content.error_state"
            className="text-center py-16 max-w-6xl mx-auto"
            style={{ color: "oklch(0.50 0.04 130)" }}
          >
            <p className="text-lg">
              Failed to load updates. Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !isError && (!contents || contents.length === 0) && (
          <div
            data-ocid="content.empty_state"
            className="text-center py-16 max-w-6xl mx-auto"
            style={{ color: "oklch(0.50 0.04 130)" }}
          >
            <p className="text-lg">There are no available updates.</p>
          </div>
        )}

        {!isLoading && !isError && contents && contents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {contents.map((item, idx) => (
              <article
                key={item.id}
                data-ocid={`content.item.${idx + 1}`}
                className="rounded-lg overflow-hidden shadow-sm flex flex-col transition-all duration-300"
                style={{
                  backgroundColor: OLIVE_CARD,
                  border: `1px solid ${OLIVE_ACCENT}25`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border =
                    `1px solid ${OLIVE_ACCENT}70`;
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    `0 4px 20px ${OLIVE_ACCENT}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border =
                    `1px solid ${OLIVE_ACCENT}25`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {item.imageUrl && (
                  <div
                    className="w-full h-44 overflow-hidden"
                    style={{ backgroundColor: "oklch(0.10 0.03 130)" }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-2">
                    <Badge
                      variant="outline"
                      className="text-xs uppercase tracking-wider"
                      style={{
                        borderColor: `${OLIVE_ACCENT}50`,
                        color: OLIVE_ACCENT,
                        backgroundColor: `${OLIVE_ACCENT}12`,
                      }}
                    >
                      {CONTENT_TYPE_LABELS[item.contentType] ??
                        item.contentType}
                    </Badge>
                  </div>
                  <h3
                    className="text-lg font-bold mb-2 leading-snug"
                    style={{ color: "oklch(0.94 0.01 85)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed flex-1 line-clamp-5"
                    style={{ color: "oklch(0.65 0.04 130)" }}
                  >
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
