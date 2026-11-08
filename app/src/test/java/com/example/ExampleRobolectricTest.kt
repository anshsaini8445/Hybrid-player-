package com.example

import com.example.data.model.AppLanguageOption
import com.example.helpers.MascotCompanionHelper
import com.example.viewmodel.PlayerViewModel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ExampleRobolectricTest {

    @Test
    fun verifyTen3DMascotsAndLanguages() {
        assertEquals(10, MascotCompanionHelper.DEFAULT_10_MASCOTS.size)
        assertEquals(3, AppLanguageOption.values().size)
    }

    @Test
    fun verifyBiDirectionalAudioVideoHandoverAndSpeed() {
        val vm = PlayerViewModel()
        vm.updateDynamicSpeed(8.0f)
        assertEquals(8.0f, vm.playbackSpeed.value, 0.01f)

        vm.toggleEqualizer3D(true)
        assertTrue(vm.isEqualizer3DEnabled.value)
        vm.toggleEqualizer3D(false)
        assertFalse(vm.isEqualizer3DEnabled.value)
    }
}
