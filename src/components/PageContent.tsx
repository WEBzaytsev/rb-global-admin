import {ReactNode, useEffect, useRef, useState} from "react";
import SelectBlockList from "./SelectBlockList.tsx";
import {ClientTextContentBlock} from "../types/blocks/TextContent.ts";
import {BlockTypes} from "../types/BlockTypes.ts";
import TextContent from "./blocks/TextContent.tsx";
import {useEditorContentContext} from "./providers/EditorContentProvider.tsx";

const blockComponents = new Map<BlockTypes, (block: ClientTextContentBlock) => ReactNode>([
    [BlockTypes.TEXT_CONTENT, (block: ClientTextContentBlock) => (<TextContent block={block} />)]
])

const PageContent = () => {
    const {editorContent} = useEditorContentContext();
    const [isBlocksListShow, setIsBlocksListShow] = useState(false);
    const selectBlockListRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent): void => {
            if (
                selectBlockListRef.current &&
                !selectBlockListRef.current.contains(e.target as Node)
            ) {
                setIsBlocksListShow(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const hideBlocksList = () => {
        setIsBlocksListShow(false);
    }

    const showBlocksList = () => {
        setIsBlocksListShow(true);
    }

    const renderBlock = (block: ClientTextContentBlock) => {
        const component = blockComponents.get(block.blockType);

        return (
            <>
                {component && component(block)}
            </>
        )
    }

    return (
        <>
            {editorContent.map((block: ClientTextContentBlock, idx: number) => (
                <div key={idx}>
                    {renderBlock(block)}
                </div>
            ))}

            <div style={{
                position: 'relative',
                padding: 5,
            }}>
                <button
                    onClick={showBlocksList}
                    style={{
                        backgroundColor: '#fff',
                        display: 'block',
                        width: '100%',
                        padding: 5,
                        outline: 'none',
                        border: '1px solid #999',
                        fontSize: 20,
                        cursor: "pointer",
                        textAlign: 'center'
                    }}
                >
                    +
                </button>

                {isBlocksListShow && (
                    <div ref={selectBlockListRef}>
                        <SelectBlockList hideBlocksList={hideBlocksList} />
                    </div>
                )}
            </div>
        </>
    )
}

export default PageContent;