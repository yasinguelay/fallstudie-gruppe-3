function SingleMovie(props) {
    const handleClick = (e) => {
        props.onMovieChosen(e.currentTarget.id);
    }


    return (
        <div id={props.title} onClick={handleClick}>
            <img src={props.image} />
            <p>{props.title}</p>
        </div>
    );
}

export default SingleMovie;