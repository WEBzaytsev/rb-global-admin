import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import LayoutPage from "../layout";
import {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Message} from '@arco-design/web-react';
import {DateValue, RbEvent} from "../types/RbEvent.ts";

const host = import.meta.env.VITE_HOST;
const protocol = import.meta.env.VITE_PROTOCOL;
const path = 'api/v1/events';

const EditorEvent = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState<boolean>(!!id);
    const [number, setNumber] = useState<null | number>(null);
    const [date, setDate] = useState<DateValue>(new Date());
    const [place, setPlace] = useState<string>('');
    const [eventUrl, setEventUrl] = useState<string>('');
    const [isShow, setIsShow] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect((): void => {
        if (!id) return;

        const apiUrl = `${host}:${protocol}/${path}/${id}`;
        const getEvent = async (): Promise<void> => {
            await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })
                .then((res: Response) => res.json())
                .then((data: RbEvent): void => {
                    const {number, date, url, isShow, place} = data;
                    setNumber(number);
                    setDate(date);
                    setEventUrl(url);
                    setIsShow(isShow);
                    setPlace(place);
                    setLoading(false);
                });
        }
        getEvent();
    }, []);

    const handleSave = useCallback(async (): Promise<void> => {
        const apiUrl = `${host}:${protocol}/${path}/${id}`;

        let body = {
            number,
            isShow,
            place,
            date,
            url: eventUrl,
        };

        await fetch(apiUrl, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then((res: Response) => res.json())
            .then((): void => {
                Message.loading({
                    id: 'need_update',
                    content: 'Сохранение...',
                });
                setTimeout(() => {
                    Message.success({
                        id: 'need_update',
                        content: 'Успешно сохранено!',
                    });
                    navigate('/');
                }, 1000);
            });
    }, [number, date, eventUrl, isShow, place]);

    const handleCreate = async (): Promise<void> => {
        const apiUrl = `${host}:${protocol}/${path}`;

        let body = {
            number,
            isShow,
            place,
            date,
            url: eventUrl,
        };

        await fetch(apiUrl, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        Message.loading({
            id: 'need_update',
            content: 'Создание...',
        });

        setTimeout(() => {
            Message.success({
                id: 'need_update',
                content: 'Успешно!',
            });
            navigate('/');
        }, 1000);
    }

    return (
        <LayoutPage>
            {loading ?
                <p>Загрузка...</p> :
                <>
                    <div className="editor-page">

                        <div style={{marginBottom: 16}}>
                            <label htmlFor="eventNumber">Номер встречи</label>
                            <input
                                id="eventNumber"
                                className="title-editor"
                                onChange={(e) => setNumber(Number(e.target.value))}
                                value={number?.toString()}
                                placeholder="Номер встречи"
                            />
                        </div>

                        <div style={{marginBottom: 16}}>
                            <label htmlFor="eventDate">Дата встречи</label>
                            <DateTimePicker
                                locale="ru-RU"
                                format="dd-MM-y h:mm a"
                                minDate={new Date()}
                                id="eventDate"
                                className="title-editor"
                                onChange={setDate}
                                value={date}
                            />
                        </div>

                        <div style={{marginBottom: 16}}>
                            <label htmlFor="eventUrl">Ссылка на регистрацию</label>
                            <input
                                id="eventUrl"
                                className="title-editor"
                                onChange={(e) => setEventUrl(e.target.value)}
                                value={eventUrl}
                                placeholder="Ссылка на регистрацию"
                            />
                        </div>

                        <div style={{marginBottom: 16}}>
                            <label htmlFor="eventPlace">Место проведения</label>
                            <input
                                id="eventPlace"
                                className="title-editor"
                                onChange={(e) => setPlace(e.target.value)}
                                value={place}
                                placeholder="Место проведения"
                            />
                        </div>


                        <label htmlFor="isShow" style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: 'fit-content',
                            columnGap: 20,
                            margin: '10px 0 16px'
                        }}>
                            <span style={{
                                flexShrink: 0,
                                flexGrow: 0
                            }}>
                                Доступна для просмотра?
                            </span>
                            <input
                                type="checkbox"
                                id="isShow"
                                className="title-editor"
                                onChange={() => setIsShow(!isShow)}
                                checked={isShow}
                                placeholder="Ссылка на регистрацию"
                            />
                        </label>

                        {(id === undefined) ?
                            <button className="editor-save" onClick={handleCreate}>Создать</button> :
                            <button className="editor-save" onClick={handleSave}>Сохранить</button>
                        }
                    </div>
                </>
            }
        </LayoutPage>
    )
}

export default EditorEvent;