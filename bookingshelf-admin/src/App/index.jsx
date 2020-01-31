import React, {Suspense} from 'react';
import PreContent from '../PreContent'

const Content = React.lazy(() => import("../Content"));

const App = () => {
    return (
        <React.Fragment>
            <PreContent />
            <Suspense fallback={null}>
                <Content />
            </Suspense>
        </React.Fragment>

    );
}


export default App;
