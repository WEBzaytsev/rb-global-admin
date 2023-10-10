import LayoutPage from "../layout";
import {useEffect, useState} from 'react';
import {List} from '@arco-design/web-react';
import {Link, useNavigate} from "react-router-dom";
import formatDateString from "../utils/formatDateString.ts";

const host = import.meta.env.VITE_HOST;
const protocol = import.meta.env.VITE_PROTOCOL;
const path = 'api/v1';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const getPosts = async (postType: string) => {
        const url = `${host}:${protocol}/${path}/${postType}`;
        await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                switch (postType) {
                    case 'posts':
                        setPosts(data);
                        break;
                    case 'events':
                        setEvents(data);
                        break;
                }
                setLoading(false);
            });
    }

    useEffect(() => {
        getPosts('posts');
        getPosts('events');
    }, [])

    const deletePage = async (postId: number) => {
        const url = `${host}:${protocol}/${path}/posts/${postId}`;
        await fetch(url, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPosts(posts.filter((element: any) => element.postId !== postId))
            });
    }

    const deleteEvent = async (id: number) => {
        const url = `${host}:${protocol}/${path}/events/${id}`;
        await fetch(url, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPosts(posts.filter((element: any) => element.postId !== id))
            });
    }

    const actionRender = (item: any) => (
        <>
            {item.postId && (
                <>
                    <Link
                        to={`/editor/${item.postId}`}
                        className='list-demo-actions-button'
                        style={{
                            marginRight: 20,
                            color: "#000",
                            textDecoration: "none"
                        }}
                    >
                        Редактировать
                    </Link>
                    <span onClick={() => deletePage(item.postId)} className='list-demo-actions-button'>Удалить</span>
                </>
            )}

            {(item.id && !item.postId) && (
                <>
                    <Link
                        to={`/editor-event/${item.id}`}
                        className='list-demo-actions-button'
                        style={{
                            marginRight: 20,
                            color: "#000",
                            textDecoration: "none"
                        }}
                    >
                        Редактировать
                    </Link>
                    <span onClick={() => deleteEvent(item.id)} className='list-demo-actions-button'>Удалить</span>
                </>
            )}
        </>
    )

    const render = (_actions: any, item: any, index: any) => (
        <List.Item
            className={index}
            key={index}
            actions={[actionRender(item)]}
        >
            <List.Item.Meta
                title={item.title || `Встреча № ${item.number} (${item.place}) ${formatDateString(item.date)}`}
            />
        </List.Item>
    );

    const addPage = () => {
        navigate("/editor");
    }

    const addEvent = () => {
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
                        render={render.bind(null, [])}
                    />
                    <button onClick={addPage} style={{marginTop: 30}} className="editor-save">Создать страницу</button>

                    <List
                        header={<div>Встречи</div>}
                        className='list-demo-actions'
                        style={{width: 1000, marginTop: '50px'}}
                        dataSource={events}
                        noDataElement={<div style={{textAlign: "center", padding: 40}}>Встреч не найдено:(</div>}
                        render={render.bind(null, [])}
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