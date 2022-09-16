let size = 8;

writeHTML = (data) => {
    console.log(data.records[2])
    // WRITE SEARCH COUNT INFO
    let searchCount = document.createElement("p");
    searchCount.id = "search-count";

        // WORDING VARIATIONS FOR SEARCH COUNT INFO
        // -> IF RESULTS ARE SHOWN ON ONE PAGE (RESULTS < 8)
        if (data.info.totalrecords <= 8 && data.info.totalrecords != 0  && data.info.totalrecords != 1){
            searchCount.innerHTML = `Showing ${data.info.totalrecords} works`;
        }
        // -> IF THERE ARE NO RESULTS (RESULTS = 0)
        else if (data.info.totalrecords < 1){
            searchCount.innerHTML = `Sorry, we couldn’t find any results matching your criteria. Why not try removing some filters or searching by a different keyword in the field above?`;
        }
        // -> IF RESULT is 1 (RESULT = 8)
        else if (data.info.totalrecords == 1){
            searchCount.innerText = `${data.info.totalrecords} work`;
        }
        // -> IF RESULTS ARE SHOWN ON TWO PAGES (RESULTS > 8)
        else{
            searchCount.innerText = `Showing ${data.info.totalrecordsperquery} out of ${data.info.totalrecords} works`;
        }
    document.querySelector("#collection-wrapper").appendChild(searchCount);

    // WRITE CONTENT ELEMENTS FOR EACH ITEM
    for (let i = 0; i < data.records.length ; i++) {
        // HIDE OR UNSET "LOAD MORE" BUTTON (DOES'NT WORK WITH AMBROTYPE AND AUDIOVISUAL WORKS)
        if (data.info.pages <= 1){
            document.querySelector("#show-more-button").style.display = "none";
        }
        else{
            document.querySelector("#show-more-button").style.display = "unset";
        }

        // WRITE WRAPPER ELEMENT FOR EACH RECORD
        let recordLinkElement = document.createElement("a");
        recordLinkElement.href = data.records[i].url;
        recordLinkElement.target = "blank"
        let recordWrapperElement = document.createElement("div");
        recordWrapperElement.className = "record-wrapper";
        recordWrapperElement.id = data.records[i].id;
        document.querySelector("#collection-wrapper").appendChild(recordLinkElement);
        recordLinkElement.appendChild(recordWrapperElement);

        // WRITE RECORD ELEMENTS
            // WRITE IMAGE
            writePicture = () =>{
                // VARIATION 1 FOR RECORDS WITH NO IMAGE
                if (data.records[i].primaryimageurl == undefined || data.records[i].primaryimageurl == 0){
                    let recordDivElement = document.createElement("div");
                    recordDivElement.id = "placeholder-image";
                    if (data.records[i].colors != undefined){
                        recordDivElement.style.backgroundColor = `${data.records[i].colors[0].color}`
                    }
                    else{
                        recordDivElement.style.backgroundColor = `gray`
                    }
                    recordWrapperElement.appendChild(recordDivElement);
                }
                // VARIATION 2 FOR RECORDS WITH AN IMAGE
                else{
                    let recordImageElement = document.createElement("img");
                    recordImageElement.src = data.records[i].primaryimageurl;
                    recordWrapperElement.appendChild(recordImageElement);
                }
            }
            writePicture();

            // WRITE ARTIST NAME (ONLY DISPLAYING FIRST PEOPLE)
            if (data.records[i].peoplecount >= 1){
                let recordArtistElement = document.createElement("h3");
                recordArtistElement.innerText = data.records[i].people[0].name;
                recordWrapperElement.appendChild(recordArtistElement);
            }

            // WRITE TITLE
            let recordTitleElement = document.createElement("p");
            recordTitleElement.innerText = data.records[i].title;
            recordWrapperElement.appendChild(recordTitleElement);

            // WRITE CLASSIFICATION
            let classificationElement = document.createElement("p");
            classificationElement.className = "classification";
            classificationElement.innerText = data.records[i].classification;
            recordWrapperElement.appendChild(classificationElement);
            }
}

// WRITE FILTER FOR CENTURY
writeCenturyFilter = (century) => {
    for (let i = 0; i < century.records.length; i++) {
        let filterCenturyElement = document.createElement("option");
        filterCenturyElement.innerHTML = `${century.records[i].name}`;
        filterCenturyElement.value = century.records[i].id;
        document.querySelector("#filter-century").appendChild(filterCenturyElement);
    }
}

// WRITE FILTER FOR TECHNIQUE
writeTechniqueMediumFilter = (technique) => {
    for (let i = 0; i < technique.records.length; i++) {
        let filterTechniqueMediumElement = document.createElement("option");
        filterTechniqueMediumElement.innerHTML = `${technique.records[i].name}`;
        filterTechniqueMediumElement.value = technique.records[i].id;
        document.querySelector("#filter-technique").appendChild(filterTechniqueMediumElement);
    }
}

// WRITE FILTER FOR CLASSIFICATION
writeClassificationFilter = (classification) => {
    for (let i = 0; i < classification.records.length; i++) {
        let filterClassificationElement = document.createElement("option");
        filterClassificationElement.innerHTML = `${classification.records[i].name}`;
        filterClassificationElement.value = classification.records[i].id;
        document.querySelector("#filter-classification").appendChild(filterClassificationElement);
    }
}

// CLICK ON "SEE MORE" TO LOAD MORE ITEMS
document.querySelector("button").addEventListener("click", (event) => {
    event.preventDefault();
    let keyword = document.querySelector("#search-collection").value;
    let centuryId = document.querySelector("#filter-century").value;
    let techniqueId = document.querySelector("#filter-technique").value;
    let classificationId = document.querySelector("#filter-classification").value;
    size += 8;
    harvardCollection(size, keyword, centuryId, techniqueId, classificationId);
})

// SEARCH ON FILTER CHANGE
document.querySelectorAll("select").forEach(btn => {
    btn.addEventListener("change", () => {
        let keyword = document.querySelector("#search-collection").value;
        let centuryId = document.querySelector("#filter-century").value;
        let techniqueId = document.querySelector("#filter-technique").value;
        let classificationId = document.querySelector("#filter-classification").value;
        harvardCollection(8, keyword, centuryId, techniqueId, classificationId);
    });
})

// SEARCH KEYWORD ON KEYPRESS
document.querySelector("#search-collection").addEventListener("keypress", (event) =>{
    if (event.keyCode === 13) {
        let keyword = document.querySelector("#search-collection").value;
        let centuryId = document.querySelector("#filter-century").value;
        let techniqueId = document.querySelector("#filter-technique").value;
        let classificationId = document.querySelector("#filter-classification").value;
        harvardCollection(8, keyword, centuryId, techniqueId, classificationId);
    }
})

// ################################################################
// FETCHES ########################################################
// ################################################################

// FETCH ON SIDE LOAD
let harvardCollection = (size, keyword, centuryId, techniqueId, classificationId) =>{
    fetch (`https://api.harvardartmuseums.org/object?sort=accessionyear&size=${size}&q=${keyword}&technique=${techniqueId}&century=${centuryId}&classification=${classificationId}&apikey=YOUR_API_KEY`)
        .then((response) => response.json())
            .then((data) => {
                document.querySelector("#collection-wrapper").innerText = "";
                writeHTML(data);
            }
        )
}
harvardCollection(size, "", "any", "any", "any");

// FETCH "CENTURY" FILTER
fetch(`https://api.harvardartmuseums.org/century?size=100&sort=name&apikey=YOUR_API_KEY`)
    .then((response) => response.json())
    .then((century) => {
        writeCenturyFilter(century);
    })

// FETCH "CLASSIFICATION" FILTER
fetch(`https://api.harvardartmuseums.org/classification?size=100&sort=name&apikey=YOUR_API_KEY`)
    .then((response) => response.json())
    .then((classification) => {
        writeClassificationFilter(classification);
    })

// FETCH "TECHNIQUE" FILTER
fetch(`https://api.harvardartmuseums.org/technique?size=318&sort=name&apikey=YOUR_API_KEY`)
    .then((response) => response.json())
    .then((technique) => {
        writeTechniqueMediumFilter(technique);
    })