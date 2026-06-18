// Hand-authored design-sync entry: re-exports the src/components/ui primitives
// as named exports so esbuild can bundle just the design system (not the whole
// Next.js app). Default-export components (Input, Label, PasswordInput) are
// re-exported as named. Resolved via tsconfig `@/*` paths by the converter.
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
export { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
export { Badge, badgeVariants } from '@/components/ui/badge'
export { Button, buttonVariants } from '@/components/ui/button'
export { Calendar } from '@/components/ui/calendar'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
export { Checkbox } from '@/components/ui/checkbox'
export {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
export {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
export { default as Input } from '@/components/ui/input'
export { default as Label } from '@/components/ui/label'
export { default as PasswordInput } from '@/components/ui/PasswordInput'
export { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
export { Progress } from '@/components/ui/progress'
export { ScrollArea, ScrollBar } from '@/components/ui/scrollArea'
export {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton,
  SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue,
} from '@/components/ui/select'
export { Skeleton } from '@/components/ui/skeleton'
export { Slider } from '@/components/ui/slider'
export { Toaster } from '@/components/ui/sonner'
export { Switch } from '@/components/ui/switch'
export {
  Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
export { Textarea } from '@/components/ui/textArea'
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
export { XIcon } from '@/components/ui/XIcon'
