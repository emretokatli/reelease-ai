import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'reelease-ai'

export function FAQ() {
  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>How does scheduling work?</AccordionTrigger>
          <AccordionContent>
            Pick a date and time and Reelease AI publishes your post automatically
            to every connected account — no reminders needed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Which platforms are supported?</AccordionTrigger>
          <AccordionContent>
            Instagram, Facebook, LinkedIn, X and TikTok, with more added every month.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I edit a scheduled post?</AccordionTrigger>
          <AccordionContent>
            Yes — edit the caption, media or timing any time before it goes live.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
