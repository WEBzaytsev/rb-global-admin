import { PageHeader } from '@arco-design/web-react';
import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <div style={{ background: 'var(--color-fill-4)', borderBottom: '4px solid var(--color-neutral-3)', marginBottom: 50}}>
            <Link to="/" className='logo-link'>
                <PageHeader
                    style={{ background: 'var(--color-bg-4)' }}
                    title='RB-Global'
                    subTitle='Admin panel'
                />
            </Link>
        </div>
    )
}

export default Header;