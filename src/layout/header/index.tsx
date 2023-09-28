import { PageHeader } from '@arco-design/web-react';
const Header = () => {
    return (
        <div style={{ background: 'var(--color-fill-4)', borderBottom: '4px solid var(--color-neutral-3)', marginBottom: 50}}>
            <PageHeader
                style={{ background: 'var(--color-bg-4)' }}
                title='RB-Global'
                subTitle='Admin panel'
            />
        </div>
    )
}

export default Header;