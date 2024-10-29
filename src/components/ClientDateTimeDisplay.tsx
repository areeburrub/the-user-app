'use client'
import {format} from "date-fns";

export default function DateDisplay({ datetime }: { datetime: Date}) {

    return (
        <span>{format(new Date(datetime), "dd MMM yyyy - hh:mm aa")}</span>
    );
}