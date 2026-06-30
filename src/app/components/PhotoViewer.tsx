import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';

const NEED_MORE_THRESHOLD = 5;

interface PhotoViewerProps {
  fileUrl: string;
  title: string;
  description?: string | null;
  currentIndex: number;
  totalItems: number;
  loadedItems: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  isLoadingMore?: boolean;
  onNeedMore?: () => void;
}

export function PhotoViewer({
  fileUrl,
  title,
  description,
  currentIndex,
  totalItems,
  loadedItems,
  onClose,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  isLoadingMore = false,
  onNeedMore,
}: PhotoViewerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasPendingNavigationRef = useRef(false);
  const preloadedAtRef = useRef(0);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }

    const focusableElements = overlay.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return;
      }
      if (!first || !last) {
        return;
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleTab);

    return () => {
      window.removeEventListener('keydown', handleTab);
    };
  }, []);

  useEffect(() => {
    if (canGoNext && hasPendingNavigationRef.current) {
      hasPendingNavigationRef.current = false;
      onNext();
    }
  }, [canGoNext, onNext]);

  useEffect(() => {
    if (
      loadedItems < totalItems &&
      !isLoadingMore &&
      currentIndex >= loadedItems - NEED_MORE_THRESHOLD &&
      loadedItems > preloadedAtRef.current
    ) {
      preloadedAtRef.current = loadedItems;
      onNeedMore?.();
    }
  }, [currentIndex, loadedItems, totalItems, isLoadingMore, onNeedMore]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        if (canGoPrev) {
          onPrev();
        }
      } else if (event.key === 'ArrowRight') {
        if (canGoNext) {
          hasPendingNavigationRef.current = false;
          onNext();
        } else if (loadedItems < totalItems) {
          hasPendingNavigationRef.current = true;
          if (!isLoadingMore) {
            onNeedMore?.();
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    canGoPrev,
    canGoNext,
    loadedItems,
    totalItems,
    isLoadingMore,
    onClose,
    onPrev,
    onNext,
    onNeedMore,
  ]);

  const handlePrev = () => {
    if (canGoPrev) {
      onPrev();
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      hasPendingNavigationRef.current = false;
      onNext();
      return;
    }

    if (loadedItems < totalItems) {
      hasPendingNavigationRef.current = true;
      if (!isLoadingMore) {
        onNeedMore?.();
      }
    }
  };

  const hasMoreItems = loadedItems < totalItems;
  const isAtTrueEnd = !canGoNext && !hasMoreItems;

  const getNextButtonLabel = () => {
    if (canGoNext) {
      return 'Следующий файл';
    }
    if (isLoadingMore) {
      return 'Загрузка...';
    }
    if (hasMoreItems) {
      return 'Загрузить ещё';
    }
    return 'Последний файл';
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex flex-col bg-black/85"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр фотографий"
      >
        <div className="flex items-center justify-between flex-shrink-0 h-14 px-4 md:px-6">
          <span className="text-white text-sm md:text-base truncate mr-4">{title}</span>
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-white/70 text-sm whitespace-nowrap">
              {currentIndex + 1} / {totalItems}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center relative min-h-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="absolute left-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-start pl-2 md:pl-4 z-10 disabled:opacity-0 group cursor-pointer"
            aria-label="Предыдущий файл"
          >
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </div>
          </button>

          <div className="flex items-center justify-center w-full h-full p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.img
                key={fileUrl}
                src={fileUrl}
                alt={title}
                className="max-w-full max-h-full object-contain select-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                draggable={false}
              />
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={isAtTrueEnd}
            className="absolute right-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-end pr-2 md:pr-4 z-10 disabled:opacity-0 group cursor-pointer"
            aria-label={getNextButtonLabel()}
          >
            {!canGoNext && isLoadingMore ? (
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <div
                className={`
                  flex items-center justify-center
                  w-10 h-10 md:w-12 md:h-12
                  rounded-full bg-black/40 text-white
                  transition-opacity
                  ${canGoNext || hasMoreItems ? 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100' : ''}
                  ${!canGoNext && hasMoreItems && !isLoadingMore ? 'opacity-60' : ''}
                `}
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
              </div>
            )}
          </button>
        </div>

        {description && (
          <div className="flex-shrink-0 px-4 md:px-6 py-3">
            <p className="text-white/80 text-sm text-center max-w-2xl mx-auto line-clamp-2">
              {description}
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
