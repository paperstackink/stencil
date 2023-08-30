import { compile } from '@/index'

import Template from '../dumping/Template.stencil'
import Entry from '../dumping/Components/Entry.stencil'
import String from '../dumping/Components/String.stencil'
import Toggle from '../dumping/Components/Toggle.stencil'
import Literal from '../dumping/Components/Literal.stencil'
import Entries from '../dumping/Components/Entries.stencil'
import Separator from '../dumping/Components/Separator.stencil'
import RootRecord from '../dumping/Components/RootRecord.stencil'
import RootString from '../dumping/Components/RootString.stencil'
import MoreToggle from '../dumping/Components/MoreToggle.stencil'
import ArrowToggle from '../dumping/Components/ArrowToggle.stencil'
import Description from '../dumping/Components/Description.stencil'
import ExtraToggle from '../dumping/Components/ExtraToggle.stencil'
import EntryString from '../dumping/Components/EntryString.stencil'
import EntryRecord from '../dumping/Components/EntryRecord.stencil'
import EntryLiteral from '../dumping/Components/EntryLiteral.stencil'
import RecordToggle from '../dumping/Components/RecordToggle.stencil'
import EntryFunction from '../dumping/Components/EntryFunction.stencil'

export default async function compileDumpPage($record) {
    const output = await compile(Template, {
        components: {
            Entry,
            String,
            Toggle,
            Literal,
            Entries,
            Separator,
            RootRecord,
            RootString,
            MoreToggle,
            ArrowToggle,
            Description,
            ExtraToggle,
            EntryString,
            EntryRecord,
            EntryLiteral,
            RecordToggle,
            EntryFunction,
        },
        environment: {
            global: {
                data: $record,
            },
        },
    })

    return output
}
