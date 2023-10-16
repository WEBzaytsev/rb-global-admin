import {BlockTypes} from "../types/BlockTypes.ts";
import {useEditorContentContext} from "./providers/EditorContentProvider.tsx";

interface Props {
    hideBlocksList: () => void;
}

const blocks = Object.values(BlockTypes).map((item) => ({
    type: item,
    // todo: add icons
    icon: ''
}));

const SelectBlockList = (props: Props) => {
    const {hideBlocksList} = props;
    const {addEditorContentItem} = useEditorContentContext();

    const select = (type: BlockTypes): void => {
        addEditorContentItem(type);
        hideBlocksList();
    }

    const formattedBlockTitle = (typeTitle: string): string => {
        return typeTitle
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/^./, (str) => str.toUpperCase());
    }

    return (
        <div
            className=""
            style={{
                display: "flex",
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: '10px',
                backgroundColor: '#fff',
                borderRadius: '6px',
                border: '1px solid #999',
                padding: '5px 10px',
                top: '110%',
                left: '50%',
                transform: 'translateX(-50%)'
            }}
        >
            {blocks.map((block) => (
                <div
                    key={block.type}
                    style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid #999',
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                    }}
                    onClick={() => select(block.type)}
                >
                    {formattedBlockTitle(block.type)}
                </div>
            ))}
        </div>
    )
}

export default SelectBlockList;