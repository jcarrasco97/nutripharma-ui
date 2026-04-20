import * as React from "react"
import { cn } from "../../utils/utils"

const Table = React.forwardRef(({ className, ...props }, ref) => (
    <div data-slot="table-container" className="relative w-full overflow-x-auto rounded-xl border border-gray-100 bg-surface shadow-sm">
        <table
            ref={ref}
            data-slot="table"
            className={cn("w-full caption-bottom text-sm text-neutral", className)}
            {...props}
        />
    </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead
        ref={ref}
        data-slot="table-header"
        className={cn("[&_tr]:border-b border-gray-100 bg-gray-50/50", className)}
        {...props}
    />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        data-slot="table-body"
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        data-slot="table-footer"
        className={cn("border-t border-gray-100 bg-gray-50/50 font-medium text-secondary [&>tr]:last:border-b-0", className)}
        {...props}
    />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        data-slot="table-row"
        className={cn(
            "border-b border-gray-100 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50",
            className
        )}
        {...props}
    />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
    <th
        ref={ref}
        data-slot="table-head"
        className={cn(
            "h-12 px-4 text-left align-middle font-bold text-neutral/70 whitespace-nowrap [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td
        ref={ref}
        data-slot="table-cell"
        className={cn("p-4 align-middle whitespace-nowrap text-secondary [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        data-slot="table-caption"
        className={cn("mt-4 text-sm text-neutral/50", className)}
        {...props}
    />
))
TableCaption.displayName = "TableCaption"

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
}