import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'reelease-ai'

export function Default() {
  return (
    <div style={{ padding: 56, display: 'flex', justifyContent: 'center' }}>
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger asChild>
            <Button variant="outline">Schedule</Button>
          </TooltipTrigger>
          <TooltipContent>Publishes automatically at the chosen time</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
