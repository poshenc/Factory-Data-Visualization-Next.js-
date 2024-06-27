// import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = () => {
    return (
        <>
            <header className={styles.header}>
                {/* <Link className='text-link' to="/"> */}
                <div className={styles.left}>
                    <div>
                        {/* <Image src="/euno-ai-logo.png"
                            width={40}
                            height={42}
                            alt="logo" /> */}
                    </div>
                    <span>Factory Data Visualization</span>
                </div>
                {/* </Link > */}
            </header>
        </>
    )
}

export default Header