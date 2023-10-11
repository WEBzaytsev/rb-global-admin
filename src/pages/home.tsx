import LayoutPage from "../layout";
import {ReactNode, useEffect, useState} from 'react';
import {List} from '@arco-design/web-react';
import {Link, useNavigate} from "react-router-dom";
import formatDateString from "../utils/formatDateString.ts";
import {PageData} from "../types/PageData.ts";
import {RbEvent} from "../types/RbEvent.ts";

const host = import.meta.env.VITE_HOST;
const protocol = import.meta.env.VITE_PROTOCOL;
const path = 'api/v1';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PageData[]>([]);
    const [events, setEvents] = useState<RbEvent[]>([]);
    const navigate = useNavigate();

    const getPosts = async (postType: string): Promise<void> => {
        const url = `${host}:${protocol}/${path}/${postType}`;
        await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })
            .then((res: Response) => res.json())
            .then((data: RbEvent | PageData): void => {
                // Todo: fix by using post types in DB
                switch (postType) {
                    case 'posts':
                        // @ts-ignore
                        setPosts(data);
                        break;
                    case 'events':
                        // @ts-ignore
                        setEvents(data);
                        break;
                }
                setLoading(false);
            });
    }

    useEffect((): void => {
        getPosts('posts');
        getPosts('events');
    }, [])

    const deletePage = async (postId: number): Promise<void> => {
        const url = `${host}:${protocol}/${path}/posts/${postId}`;
        await fetch(url, {
            method: "DELETE"
        })
            .then((res: Response) => res.json())
            .then((): void => setPosts(posts.filter((element: PageData) => element.postId !== postId)));
    }

    const deleteEvent = async (id: number): Promise<void> => {
        const url = `${host}:${protocol}/${path}/events/${id}`;
        await fetch(url, {
            method: "DELETE"
        })
            .then((res: Response) => res.json())
            .then((): void => setEvents(events.filter((element: RbEvent) => element.id !== id)));
    }

    const actionRenderPage = (pageData: PageData): ReactNode => (
        <>
            <Link
                to={`/editor/${pageData.postId}`}
                className='list-demo-actions-button'
                style={{
                    marginRight: 20,
                    color: "#000",
                    textDecoration: "none"
                }}
            >
                Редактировать
            </Link>
            <span onClick={() => deletePage(pageData.postId)} className='list-demo-actions-button'>Удалить</span>
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
            <span onClick={() => deleteEvent(eventData.id)} className='list-demo-actions-button'>Удалить</span>
        </>
    );

    const renderEvents = (_actions: [], item: RbEvent, index: number) => (
        <List.Item
            className={index.toString()}
            key={index}
            actions={[actionRenderEvent(item)]}
        >
            <List.Item.Meta
                title={`Встреча № ${item.number} (${item.place}) ${formatDateString(item.date)}`}
            />
        </List.Item>
    );

    const renderPages = (_actions: [], item: PageData, index: number) => (
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
            {loading ?
                <p>Загрузка...</p> :
                <>
                    <List
                        header={<div>Страницы</div>}
                        className='list-demo-actions'
                        style={{width: 1000}}
                        dataSource={posts}
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
                    <button onClick={addEvent} style={{marginTop: 30, marginBottom: '100px'}}
                            className="editor-save">Создать встречу
                    </button>
                </>
            }
        </LayoutPage>
    );
}

export default Home;