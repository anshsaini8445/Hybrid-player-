package com.example.helpers

import com.example.R

data class MascotCompanionModel(
    val id: String,
    val name: String,
    val badge: String,
    val hatStyle: String,
    val cassetteTitle: String,
    val drawableRes: Int,
    val customPhotoUri: String? = null
)

/**
 * 10 Distinct Photorealistic 3D Fluffy Cassette Puppy & Teddy Bear Mascots
 * with Horned Checkered Bucket Hat, Starry Galaxy Eyes, Smiley Headphones & Cassette Tape in Paws.
 */
object MascotCompanionHelper {

    val DEFAULT_10_MASCOTS = listOf(
        MascotCompanionModel(
            id = "mascot-1",
            name = "Coco Honey Teddy",
            badge = "3D PLUSH #1",
            hatStyle = "Black/White Checkered Horned Bucket Hat",
            cassetteTitle = "RETRO BASS 90",
            drawableRes = R.drawable.mascot_01_honey_teddy
        ),
        MascotCompanionModel(
            id = "mascot-2",
            name = "Biscuit Sky Puppy",
            badge = "3D PLUSH #2",
            hatStyle = "Blue/White Checkered Horned Bucket Hat",
            cassetteTitle = "LOFI CLOUD",
            drawableRes = R.drawable.mascot_02_sky_puppy
        ),
        MascotCompanionModel(
            id = "mascot-3",
            name = "Mochi Berry Teddy",
            badge = "3D PLUSH #3",
            hatStyle = "Pink/Black Checkered Horned Bucket Hat",
            cassetteTitle = "PINK SYNTH",
            drawableRes = R.drawable.mascot_03_berry_teddy
        ),
        MascotCompanionModel(
            id = "mascot-4",
            name = "Truffle Mocha Pup",
            badge = "3D PLUSH #4",
            hatStyle = "Teal/White Checkered Horned Bucket Hat",
            cassetteTitle = "MIDNIGHT 808",
            drawableRes = R.drawable.mascot_04_mocha_puppy
        ),
        MascotCompanionModel(
            id = "mascot-5",
            name = "Snowball Polar Teddy",
            badge = "3D PLUSH #5",
            hatStyle = "Purple/White Checkered Horned Bucket Hat",
            cassetteTitle = "ICE CRYSTAL",
            drawableRes = R.drawable.mascot_05_snow_teddy
        ),
        MascotCompanionModel(
            id = "mascot-6",
            name = "Caramel Golden Pup",
            badge = "3D PLUSH #6",
            hatStyle = "Red/Black Checkered Horned Bucket Hat",
            cassetteTitle = "GOLD VINYL",
            drawableRes = R.drawable.mascot_06_golden_puppy
        ),
        MascotCompanionModel(
            id = "mascot-7",
            name = "Taro Lavender Bear",
            badge = "3D PLUSH #7",
            hatStyle = "Violet/Gold Checkered Horned Bucket Hat",
            cassetteTitle = "DREAM POP",
            drawableRes = R.drawable.mascot_07_lavender_teddy
        ),
        MascotCompanionModel(
            id = "mascot-8",
            name = "Matcha Mint Puppy",
            badge = "3D PLUSH #8",
            hatStyle = "Emerald/Dark Checkered Horned Bucket Hat",
            cassetteTitle = "TOKYO DRIFT",
            drawableRes = R.drawable.mascot_08_mint_puppy
        ),
        MascotCompanionModel(
            id = "mascot-9",
            name = "Cinnamon Sunset Pup",
            badge = "3D PLUSH #9",
            hatStyle = "Orange/Black Checkered Horned Bucket Hat",
            cassetteTitle = "SUNSET FM",
            drawableRes = R.drawable.mascot_09_sunset_puppy
        ),
        MascotCompanionModel(
            id = "mascot-10",
            name = "Galaxy Cosmic Teddy",
            badge = "3D PLUSH #10",
            hatStyle = "Cyan/Navy Checkered Horned Bucket Hat",
            cassetteTitle = "8K CYBER MIX",
            drawableRes = R.drawable.mascot_10_cosmic_teddy
        )
    )
}
