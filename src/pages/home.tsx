import LayoutPage from "../layout";
import {ReactNode, useEffect, useState} from 'react';
import {List} from '@arco-design/web-react';
import {Link, useNavigate} from "react-router-dom";
import formatDateString from "../utils/formatDateString.ts";
import {RbEvent} from "../types/RbEvent.ts";
import {deleteEvent, deletePage, getEvents, getPages} from "../api/api.ts";
import {Page} from "../types/Page.ts";

const Home = () => {
    const [loadingPages, setLoadingPages] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [pages, setPages] = useState<Page[]>([]);
    const [events, setEvents] = useState<RbEvent[]>([]);
    const navigate = useNavigate();

    useEffect((): void => {
        getPages()
            .then((res: Page[]) => {
                setPages(res);
            })
            // todo: handle error
            .catch(() => {})
            .finally(() => setLoadingPages(false));

        getEvents()
            .then((res: RbEvent[]) => {
                setEvents(res);
            })
            // todo: handle error
            .catch(() => {})
            .finally(() => setLoadingEvents(false));
    }, []);

    const removePage = async (pageId: number): Promise<void> => {
        deletePage(pageId)
            .then((): void => setPages(pages.filter((page: Page) => page.id !== pageId)))
            // todo: handle error
            .catch(() => {});
    }

    const removeEvent = async (eventId: number): Promise<void> => {
        deleteEvent(eventId)
            .then((): void => setEvents(events.filter((event: RbEvent) => event.id !== eventId)))
            // todo: handle error
            .catch(() => {});
    }

    const actionRenderPage = (pageData: Page): ReactNode => (
        <>
            <Link
                to={`/editor/${pageData.id}`}
                className='list-demo-actions-button'
                style={{
                    marginRight: 20,
                    color: "#000",
                    textDecoration: "none"
                }}
            >
                Редактировать
            </Link>
            <span onClick={() => removePage(pageData.id)} className='list-demo-actions-button'>Удалить</span>
        </>
    )

    const actionRenderEvent = (eventData: RbEvent): ReactNode => (
        <>
            <Link
                to={`/editor-event/${eventData.id}`}
                className='list-demo-actions-button'
                style={{
                    marginRight: 20,
                    color: "#000",
                    textDecoration: "none"
                }}
            >
                Редактировать
            </Link>
            <span onClick={() => removeEvent(eventData.id)} className='list-demo-actions-button'>Удалить</span>
        </>
    );

    const renderEvents = (_actions: [], item: RbEvent, index: number) => (
        <List.Item
            className={index.toString()}
            key={index}
            actions={[actionRenderEvent(item)]}
        >
            {item.date && (
                <List.Item.Meta
                    title={`Встреча № ${item.number} (${item.place}) ${formatDateString(item.date.toString())}`}
                />
            )}
        </List.Item>
    );

    const renderPages = (_actions: [], item: Page, index: number) => (
        <List.Item
            className={index.toString()}
            key={index}
            actions={[actionRenderPage(item)]}
        >
            <List.Item.Meta
                title={item.title}
            />
        </List.Item>
    );

    const addPage = (): void => {
        navigate("/editor");
    }

    const addEvent = (): void => {
        navigate("/editor-event");
    }

    return (
        <LayoutPage>
            <List
                header={<div>Страницы</div>}
                className='list-demo-actions'
                style={{width: 1000}}
                dataSource={pages}
                noDataElement={<div style={{textAlign: "center", padding: 40}}>Страниц не найдено:(</div>}
                render={renderPages.bind(null, [])}
            />
            <button onClick={addPage} style={{marginTop: 30}} className="editor-save">Создать страницу</button>

            <List
                header={<div>Встречи</div>}
                className='list-demo-actions'
                style={{width: 1000, marginTop: '50px'}}
                dataSource={events}
                noDataElement={<div style={{textAlign: "center", padding: 40}}>Встреч не найдено:(</div>}
                render={renderEvents.bind(null, [])}
            />
            <button onClick={addEvent}
                    style={{marginTop: 30, marginBottom: '100px'}}
                    className="editor-save">
                Создать встречу
            </button>
        </LayoutPage>
    );
}

export default Home;