type CourseSummaryIconProps = {
  className?: string
}

export function DepartureLocationIcon({ className }: CourseSummaryIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.75a7.25 7.25 0 0 0-7.25 7.25c0 5.28 5.56 10.15 6.86 11.22a.62.62 0 0 0 .78 0c1.3-1.07 6.86-5.94 6.86-11.22A7.25 7.25 0 0 0 12 2.75Zm0 10.45a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function EstimatedTimeIcon({ className }: CourseSummaryIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5V12l3.2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CarIcon({ className }: CourseSummaryIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.15 4.5h9.7c1 0 1.9.6 2.28 1.53l1.22 3c.96.37 1.65 1.3 1.65 2.4v5.82c0 .83-.67 1.5-1.5 1.5h-.75v.75a1.5 1.5 0 0 1-3 0v-.75h-9.5v.75a1.5 1.5 0 0 1-3 0v-.75H3.5a1.5 1.5 0 0 1-1.5-1.5v-5.82c0-1.1.69-2.03 1.65-2.4l1.22-3A2.46 2.46 0 0 1 7.15 4.5Zm-.46 2.27L5.76 9h12.48l-.93-2.23a.5.5 0 0 0-.46-.31h-9.7a.5.5 0 0 0-.46.31ZM5.75 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm12.5-3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
        fill="currentColor"
      />
    </svg>
  )
}
