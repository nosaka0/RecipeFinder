import Layout from '../components/MyLayout';
import { useRouter } from 'next/router';
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import React from "react";


const Results = props => {
    const router = useRouter();

    const { q } = router.query;

    console.log(`query object: ${q}`);

    const fullQueryData = processQueryData(q);

    const top = topSelection(processTop(fullQueryData, props.recipes));

    return (
        <Layout>
            <h1>Recipes</h1>
            <p>{processQueryData(q).length} query items:   {fullQueryData.map(e => `${e}     `)}</p>

            <ul>
                {top.map(recipe =>(
                    <li key={recipe.index}>
                        <Link href="/recipe/[id]" as={`/recipe/${recipe.index}`}>
                            <a>{recipe.title}: {recipe.calories}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </Layout>
    );
};

const topSelection = (arr) => {
    let topSel = [];

    for(let i = 0; i < 10; i++){
        if(arr.length > i){
            topSel.push(arr[i]);
        }
    }

    console.info(`Successful top selection: ${topSel.length}`);

    return topSel;
};

const sortByCalories = (arr) => {
    let len = arr.length;
    for (let i = len-1; i>=0; i--){
        for(let j = 1; j<=i; j++){
            if(arr[j-1].calories > arr[j].calories){
                let temp = arr[j-1];
                arr[j-1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
};

const processTop = (queryData, recipes) => {
    let processed = [];



    for(let i = 0; i < recipes.length; i++){
        const ing = recipes[i].ingredients;
        let count = 0;
        for(let j = 0; j < queryData.length; j++){
            if(ing.toString().includes(queryData[j])){
                count++;
            }
        }
        if(count === queryData.length){
            processed.push(recipes[i]);
        }

    }

    return processed;
};

const processQueryData = (data) => {
    if(typeof(data) === "string"){
        let processed = [];
        processed.push(data);
        return processed;
    }

    let processed = [];
    for(let i = 0; i < data.length; i++){
        processed[i] = data[i];
    }

    return processed;
};

Results.getInitialProps = async function() {
    const res = await fetch('https://raw.githubusercontent.com/ProjectRecipe/RecipeFinder/master/datasets/clean_recipes_smaller.json');
    const data = await res.json();

    console.log(`Recipe data fetched. Count: ${data.length}`);

    return {
        recipes: data
    };
};

export default Results;
