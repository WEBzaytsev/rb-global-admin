import LayoutPage from "../layout";
import { useEffect, useLayoutEffect, useState } from 'react';
import { List } from '@arco-design/web-react';
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getPost = async () => {
            await fetch(`http://localhost:3000/api/v1/posts/`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            });
        }
        getPost();
    }, [])
    
    const deletePage = async (postId: number) => {
        await fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            setPosts(posts.filter((element: any) => element.postId !== postId))
        });
    }

    const actionRender = (item: any) => (
        <>
            <Link to={`/editor/${item.postId}`} className='list-demo-actions-button' style={{marginRight: 20, color: "#000", textDecoration: "none"}}>Редактировать</Link>
            <span onClick={() => deletePage(item.postId)} className='list-demo-actions-button'>Удалить</span>
        </>
    )
    
    const render = (actions: any, item: any, index: any) => (
        <List.Item className={index} key={index} actions={[actionRender(item)]}>
            <List.Item.Meta
                title={item.title}
            />
        </List.Item>
    );

    const addPage = () => {
        navigate("/editor");
    }

    if(loading) {
        return (
            <LayoutPage>
                Загрузка...
            </LayoutPage>
        )
    }

    return (
        <LayoutPage>
            <List
                header={<div>Страницы</div>}
                className='list-demo-actions'
                style={{ width: 1000 }}
                dataSource={posts}
                noDataElement={<div style={{textAlign: "center", padding: 40}}>Страниц не найдено:(</div>}
                render={render.bind(null, [])}
            />
            <button onClick={addPage} style={{marginTop: 30}} className="editor-save">Создать страницу</button>
        </LayoutPage>
    );
}

export default Home;