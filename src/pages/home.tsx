import LayoutPage from "../layout";
import { useLayoutEffect, useState } from 'react';
import { List } from '@arco-design/web-react';

const Home = () => {
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        const getPost = async () => {
            await fetch(`http://localhost:3000/api/v1/posts/`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLoading(false);
            });
        }
        getPost();
    }, [])

    const dataSource = new Array(4).fill({
        title: 'Beijing Bytedance Technology Co., Ltd.',
    });
    
    const render = (actions: any, item: any, index: any) => (
        <List.Item key={index} actions={actions}>
            <List.Item.Meta
                title={item.title}
            />
        </List.Item>
    );

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
                className='list-demo-actions'
                style={{ width: 1000 }}
                dataSource={dataSource}
                render={render.bind(null, [
                    <span className='list-demo-actions-button'>Редактировать</span>,
                ])}
            />
        </LayoutPage>
    );
}

export default Home;