export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500 dark:border-lavender-700 dark:border-t-lavender-500"
        role="status"
        aria-label="Загрузка"
      />
    </div>
  )
}
